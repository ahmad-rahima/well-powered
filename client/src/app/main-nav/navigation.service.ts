import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class NavigationService implements OnInit {
    ngOnInit(): void {

    }
    chartsSubj = new Subject<null>();

    refreshCharts() {
        this.chartsSubj.next(null);
    }

    get chartsObserver() {
        return this.chartsSubj.asObservable();
    }

}
