import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { DateRange } from '../interfaces/date-range'


@Injectable()
export class DateSelectorService implements OnInit, OnDestroy {
    constructor() {}

    ngOnInit(): void {
        this.dates$
        .subscribe(d => {
            this.start = d.start;
            this.end = d.end;
        });
    }

    readonly MS_PER_DAY = 86400000;

    duration = 30;
    _start: Date | null = null;
    _end: Date | null = null;

    dateRngStream = new Subject<DateRange>;
    dates$: Observable<DateRange> = this.dateRngStream.pipe(
            // distinctUntilChanged(),
            debounceTime(500)
        );

    set start(start: Date) { this._start = start; }
    get start() { return this._start || this.getDateBefore(); }

    set end(end: Date) { this._end = end; }
    get end() { return this._end || new Date(); }

    get dateRange(): DateRange {
        return { start: this.start, end: this.end};
    }

    updateDateRange(dateRng: DateRange) {
        this.start = dateRng.start, this.end = dateRng.end;
        this.dateRngStream.next(dateRng);
    }

    reset() { this._start = this._end = null; }

    private getDateBefore() {
        return new Date(
            new Date().getTime() - (this.duration * this.MS_PER_DAY)
        );
    }

    ngOnDestroy(): void {}
}
