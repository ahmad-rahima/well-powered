import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AsideOptions } from './aside-options';
import { AsideOptionsService } from './aside-options.service';

@Component({
    selector: 'app-aside-options',
    templateUrl: './aside-options.component.html',
    styleUrls: ['./aside-options.component.scss']
})
export class AsideOptionsComponent implements OnInit {

    selected!: string;

    constructor(private asideOptionsService: AsideOptionsService) {}
    ngOnInit(): void {}

    selectOption($event: any) {
        this.asideOptionsService.select(this.selected);
    }

    get options$() {
        return this.asideOptionsService.options$;
    }
}
