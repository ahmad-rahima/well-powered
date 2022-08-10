import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AsideOptionsComponent } from "src/app/aside-options/aside-options.component";
import { AsideOptionsService } from "src/app/aside-options/aside-options.service";
import { DateSelectorComponent } from "src/app/date-selector/date-selector.component";
import { DateSelectorService } from "src/app/date-selector/date-selector.service";
import { DateRange } from "src/app/interfaces/date-range";
import { NavRecordsKeeperService } from "src/app/nav-records/nav-records-keeper.service";
import { AbstractChartsHandler } from "./abstract-charts-handler";
import { DateChartInitializerService } from "./chart-initializers/date-chart-initializer.service";
import { OptionsChartInitializerService } from "./chart-initializers/options-chart-initializer.service";
import { SelectionChartInitializerService } from "./chart-initializers/selection-chart-initializer.service";

@Injectable()
export class IntervalChartsHandlerService extends AbstractChartsHandler {

    readonly CHART_TYPE = 'interval';


    constructor(
        http: HttpClient,
        location: Location,
        navRecordsKeeper: NavRecordsKeeperService,

        private dateSelectorService: DateSelectorService,
        private dateInitService: DateChartInitializerService,
        private optsInitService: OptionsChartInitializerService,
        private selectInitService: SelectionChartInitializerService,
        private asideOptionsService: AsideOptionsService
    ) {
        super(http, location, navRecordsKeeper);


    }

    override configChartProps() {
        this.navRecordsRecipe = [
            DateSelectorComponent,
            AsideOptionsComponent
        ];

        this.chartInits = [
            this.dateInitService.on(this.route),
            this.optsInitService.on(this.route),
            this.selectInitService.on(this.route)
        ];

        this.observer = [
            this.dateSelectorService.dates$,
            this.asideOptionsService.observer()
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

        const selectedId = this.asideOptionsService.selectedId;

        let { start, end }: any = this.date;
        start = start.toISOString().split('T')[0];
        end = end.toISOString().split('T')[0];

        return selectedId ?
            `charts/${this.CHART_TYPE}/${chartTarget}/${selectedId}/days/${start}/${end}` :
            '';
    }
}
