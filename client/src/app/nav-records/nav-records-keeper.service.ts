import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';


@Injectable()
export class NavRecordsKeeperService {
    // change to interface AdComponent/AdItem
    recordsSubject = new Subject<any>();

    consturctor() {}

    ngOnInit() {
    }

    record(elt: any) {
        this.recordsSubject.next(elt);
    }
}
