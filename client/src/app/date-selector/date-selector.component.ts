import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';
import { DateSelectorService } from './date-selector.service';


@Component({
    selector: 'app-date-selector',
    templateUrl: './date-selector.component.html',
    styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent implements OnInit, OnDestroy {

    ngOnInit(): void {
        this.startHolder = this.start;
        this.endHolder = this.end;
    }

    range: any;

    constructor(private dateSelectorService: DateSelectorService) {
    }

    startHolder!: Date;
    endHolder!: Date;

    updateDate(startDate: string, endDate: string) {
        let start = new Date(startDate);
        let end = new Date(endDate);
        this.dateSelectorService.updateDateRange({ start, end });
    }

    get start(): Date {
        return this.dateSelectorService.start;
    }

    get end(): Date {
        return this.dateSelectorService.end;
    }

    ngOnDestroy(): void {
    }
}
