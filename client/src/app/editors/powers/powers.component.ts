import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { first, mergeMap } from 'rxjs';
import { AsideOptionsComponent } from '../../aside-options/aside-options.component';
import { NavRecordsKeeperService } from '../../nav-records/nav-records-keeper.service';
import { ItemDeletorComponent } from '../recordable-comps/item-deletor/item-deletor.component';
import { PowersService } from './powers.service';


@Component({
  selector: 'app-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['./powers.component.scss']
})
export class PowersComponent implements OnInit, OnDestroy {

  powerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private powersService: PowersService,
    private navRecordsKeeper: NavRecordsKeeperService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }
  ngOnDestroy(): void {
    console.log("PowersSerivce: OnDestroy");

    this.powersService.updates$.next(false); // disable submit on destroy
    this.subscriptions.forEach(s => s.unsubscribe());
    this.powersService.onDestroy();
  }

  subscriptions: any[] = [];
  ngOnInit(): void {
    this.powersService.onInit(this.id);

    this.powerForm = this.fb.group({
      name: ['', [
        Validators.required, Validators.minLength(3), Validators.maxLength(40)
      ]],
      unit: ['', [
        Validators.required, Validators.minLength(1), Validators.maxLength(25)
      ]],
      color: ['', Validators.required],
    });

    let tmp;
    tmp = this.powerForm.valueChanges.subscribe(_ => {
      this.powersService.updates$.next(this.powerForm.valid);
    });
    this.subscriptions.push(tmp);

    if (this.id)
      tmp = this.powersService.getItem(this.id).subscribe(v => this.patch(v));
    if (tmp) this.subscriptions.push(tmp);

    tmp = this.powersService.item
      .pipe(mergeMap(v => v))   // it returns another observable
      .subscribe(v => this.patch(v));
    if (tmp) this.subscriptions.push(tmp);

    tmp = this.powersService.submitter.updates.subscribe((_: any) => {
      this.onSubmit();
    });
    this.subscriptions.push(tmp)

    // observe messages
    tmp = this.powersService.messages$.subscribe(msg => this.msg = msg);
    this.subscriptions.push(tmp)
  }

  get id() {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  onSubmit() {
    let tmp = this.powersService.updateItem(this.id, this.powerForm.value)
      .subscribe(_ => console.log('finished submitting.'));
    this.subscriptions.push(tmp);
  }

  patch(v: any) {
    this.msg = '';
    this.powerForm.patchValue(v);
  }

  msg: string = '';
}
