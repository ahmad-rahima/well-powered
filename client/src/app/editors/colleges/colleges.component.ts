import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { first, mergeMap, Observable } from 'rxjs';
import { CollegesService } from './colleges.service';


@Component({
  selector: 'app-colleges',
  templateUrl: './colleges.component.html',
  styleUrls: ['./colleges.component.scss']
})
export class CollegesComponent implements OnInit, OnDestroy {

  collegeForm!: FormGroup;
  powerGroup!: FormGroup;
  powers$!: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private collegesService: CollegesService,
    private route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    console.log("CollegesSerivce: OnDestroy");

    this.collegesService.updates$.next(false); // disable submit on destroy
    this.subscriptions.forEach(s => s.unsubscribe());
    this.collegesService.onDestroy();
  }

  subscriptions: any[] = [];
  powersArray: any;

  ngOnInit(): void {
    this.powers$ = this.collegesService.getPowers();
    this.collegesService.onInit(this.id);

    this.powerGroup = this.fb.group({
      name: [''],
      active: [false],
      minSpan: [''],
      maxSpan: [''],
      minAmt: [''],
      maxAmt: [''],
      warn: [''],
      err: [''],
    });

    this.powersArray = this.fb.array([

    ]);

    this.collegeForm = this.fb.group({
      name: ['', [
        Validators.required, Validators.minLength(3), Validators.maxLength(70)
      ]],
      description: ['', Validators.maxLength(500)],
      email: ['', Validators.email],
      powers: this.powersArray
    });

    if (this.id)
      this.subscriptions.push(this.collegesService.getItem(this.id).subscribe(v => this.patch(v)));

    let tmp = this.collegesService.item
      .pipe(mergeMap(v => v))   // it returns another observable
      .subscribe(v => this.patch(v));
    if(tmp) this.subscriptions.push(tmp);

    // observe form's changes
    tmp = this.collegeForm.valueChanges.subscribe(_ => {
      this.collegesService.updates$.next(this.collegeForm.valid);
    });
    this.subscriptions.push(tmp);


    // observe submit clicks
    tmp = this.collegesService.submitter.updates.subscribe((_: any) => {
      this.onSubmit();
    });
    this.subscriptions.push(tmp)

  }

  get id() {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  get controls() {
    return (<FormArray>this.collegeForm.get('powers')).controls
  }

  checkErrors() {
    const powers = this.collegeForm.value['powers'].map((p: any) => p.name);
    const hasDups = (new Set(powers)).size !== powers.length;
    this.msg = `College form can not have duplicate resources.
please give every resource card a unique resource.`;

    return hasDups;
  }

  onSubmit() {
    if (this.checkErrors()) return;

    this.msg = '';
    this.collegesService.updateItem(this.id, this.collegeForm.value)
      .pipe(first())
      .subscribe(_ => console.log('finished submitting.'));
  }

  msg: string = '';
  patch(v: any) {
    this.msg = ''; // clear msg
    let powers = v.powers;
    delete v.powers;

    this.collegeForm.reset();
    this.collegeForm.patchValue(v);

    while (this.powers.length > 1) this.powers.removeAt(0);
    for (let i = 0; i < powers.length; ++i) {
      this.powers.setControl(i, this.fb.group(powers[i]));
    }
  }

  get powers() {
    return this.collegeForm.get('powers') as FormArray;
  }

  addPower() {
    // this.powers.push(this.powerGroup);
    // this.powers.setControl(this.powers.length, this.powerGroup);

    this.powers.push(this.fb.group({
      name: [''],
      active: [false],
      minSpan: [''],
      maxSpan: [''],
      minAmt: [''],
      maxAmt: [''],
      warn: [''],
      err: [''],
    }))
  }

  onDelete(i: number) {
    this.powers.removeAt(i);
  }

  printValue($event: any) {
    console.log($event.value);
  }
}
