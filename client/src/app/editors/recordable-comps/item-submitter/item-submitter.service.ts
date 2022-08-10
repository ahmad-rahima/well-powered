import { ElementRef, Injectable } from "@angular/core";
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ItemSubmitterService {
    state: boolean = false;
    form!: any;
    updates = new Subject<null>();

    take(updates$: Subject<boolean>) {
        updates$.asObservable().subscribe(s => this.state = s);
    }
}
