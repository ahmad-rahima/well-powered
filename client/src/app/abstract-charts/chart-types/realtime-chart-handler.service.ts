import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AsideOptionsComponent } from "src/app/aside-options/aside-options.component";
import { AsideOptionsService } from "src/app/aside-options/aside-options.service";
import { NavRecordsKeeperService } from "src/app/nav-records/nav-records-keeper.service";
import { AbstractChartsHandler } from "./abstract-charts-handler";
import { OptionsChartInitializerService } from "./chart-initializers/options-chart-initializer.service";
import { SelectionChartInitializerService } from "./chart-initializers/selection-chart-initializer.service";


// URL: charts/monitor/:chartTarget/:id
@Injectable()
export class RealtimeChartHandlerService extends AbstractChartsHandler {
    readonly CHART_TYPE = 'monitor';


    constructor(
        http: HttpClient,
        location: Location,
        navRecordsKeeper: NavRecordsKeeperService,

        private optsInitService: OptionsChartInitializerService,
        private selectInitService: SelectionChartInitializerService,
        private asideOptionsService: AsideOptionsService
    ) {
        super(http, location, navRecordsKeeper);
    }

    override configChartProps() {
        this.navRecordsRecipe = [
            AsideOptionsComponent
        ];

        this.chartInits = [
            this.optsInitService.on(this.route),
            this.selectInitService.on(this.route)
        ];

        this.observer = [
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

    private get requestUrl(): string {
        const chartTarget = this.route.snapshot.paramMap.get('chartTarget');
        const selectedId = this.asideOptionsService.selectedId;

        return selectedId ?
            `charts/${this.CHART_TYPE}/${chartTarget}/${selectedId}` :
            '';
    }
}
