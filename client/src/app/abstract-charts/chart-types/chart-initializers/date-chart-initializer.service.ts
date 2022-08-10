import { Injectable, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DateSelectorService } from "src/app/date-selector/date-selector.service";
import { ChartInitializer } from "./chart-initializer";


@Injectable()
export class DateChartInitializerService implements ChartInitializer {
    route!: ActivatedRoute;
    constructor(private dateSelectorService: DateSelectorService) {}

    on(route: ActivatedRoute) {
        this.route = route;
        console.log('set route to ' + this.route);
        return this;
    }

    run(): void {
        console.log('route: ' + this.route);
        const { paramMap } = this.route.snapshot;
        let start: any = paramMap.get('start');
        let end: any = paramMap.get('end');

        if (Date.parse(start) && Date.parse(end)) {
            start = new Date(start);
            end = new Date(end);
            this.dateSelectorService.updateDateRange({ start, end });
        }
    }
}
