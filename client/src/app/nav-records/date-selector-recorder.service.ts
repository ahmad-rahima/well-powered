import { Injectable, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { NavRecordsKeeperService } from './nav-records-keeper.service';


@Injectable()
export class DateSelectorRecorderService implements OnInit {
    element: string = '<app-date-selector></app-date-selector>';

    constructor(private navRecordsKeeperService: NavRecordsKeeperService) {
    }

    ngOnInit() {}

    request() {
        console.log('requesting date on service');
        this.navRecordsKeeperService.record('<app-hello></app-hello>');
    }
}
