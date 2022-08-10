import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DateSelectorComponent } from "src/app/date-selector/date-selector.component";
import { DateSelectorService } from "src/app/date-selector/date-selector.service";
import { DateRange } from "src/app/interfaces/date-range";
import { NavRecordsKeeperService } from "src/app/nav-records/nav-records-keeper.service";
import { AbstractChartsHandler } from "./abstract-charts-handler";
import { DateChartInitializerService } from "./chart-initializers/date-chart-initializer.service";


// URL: charts/total/:chartTarget
@Injectable()
export class TotalChartsHandlerService extends AbstractChartsHandler {

    readonly CHART_TYPE = 'total';


    constructor(
        http: HttpClient,
        location: Location,
        navRecordsKeeper: NavRecordsKeeperService,

        private dateSelectorService: DateSelectorService,
        private dateInitService: DateChartInitializerService,
    ) {
        super(http, location, navRecordsKeeper);
    }

    override configChartProps() {
        this.navRecordsRecipe = [
            DateSelectorComponent,
        ];

        this.chartInits = [
            this.dateInitService.on(this.route),
        ];

        this.observer = [
            this.dateSelectorService.dates$,
        ];

    }

    override fetch() {
        const requestUrl = this.requestUrl;
        if (requestUrl === '') return;

        this.charts.chartOptions$ = this.http.get(`api/${requestUrl}`);
    }

    override updateLocation() {
        this.request();
    }

    override request() {
        const requestUrl = this.requestUrl;
        if (requestUrl === '') return;

        this.location.go(requestUrl);
        this.charts.chartOptions$ = this.http.get(`api/${requestUrl}`);
    }

    private get date(): DateRange {
        let { start, end } = this.dateSelectorService;
        return { start, end };
    }

    private get requestUrl(): string {
        const { paramMap } = this.route.snapshot;
        const chartTarget = paramMap.get('chartTarget');

        let { start, end }: any = this.date;
        start = start.toISOString().split('T')[0];
        end = end.toISOString().split('T')[0];

        return `charts/${this.CHART_TYPE}/${chartTarget}/days/${start}/${end}`;
    }
}
