import { Injectable, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { NavRecordsKeeperService } from './nav-records-keeper.service';


@Injectable()
export class HelloRecorderService implements OnInit {
    element: string = '<span><strong>Hello</strong> <em>Every Body</em></span>';

    constructor(private navRecordsKeeperService: NavRecordsKeeperService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.navRecordsKeeperService.record(this.element);
            console.log(this.element);
        }, 3000);
    }
}
