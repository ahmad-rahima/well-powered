import { Location } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable, Observer, Subscription } from "rxjs";
import { NavRecordsKeeperService } from "src/app/nav-records/nav-records-keeper.service";
import { AbstractChartsComponent } from "../abstract-charts.component";
import { ChartInitializer } from "./chart-initializers/chart-initializer";
import { ChartsHandler } from "./charts-handler";

export class AbstractChartsHandler implements ChartsHandler {

    // readonly CHART_TYPE;
    // selectedId: string | null = null;
    // dateObserver$!: Subscription;
    // optionObserver$!: Subscription;
    charts!: AbstractChartsComponent;
    route!: ActivatedRoute;
    chartInits: ChartInitializer[] = [];
    navRecordsRecipe: Object[] = [];
    observer: Observable<any>[] = [];
    private subscriptions: Subscription[] = []

    constructor(
        protected http: HttpClient,
        protected location: Location,
        protected navRecordsKeeper: NavRecordsKeeperService,
    ) {

    }

    configChartProps() {
        throw new Error("Nothing to configure.");
    }

    onInit(charts: AbstractChartsComponent): void {
        this.charts = charts;
        this.route = charts.route;
        this.configChartProps();

        this.navRecordsRecipe.forEach(comp => this.navRecordsKeeper.record(comp));

        this.initSettings();
        this.observeChanges();
        this.fetch();
    }

    onChanges(): void {
        this.request();
        // this.updateLocation();
        // this.fetch();
    }

    request() {
        throw new Error("Nothing to request");
    }

    onDestroy(): void {
        // NOTE: can I ``unsubscribe`` on a subscription?
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    initSettings() {
        this.chartInits.forEach(init => init.run());
    }

    observeChanges() {
        this.subscriptions = this.observer.map(o => o.subscribe(_ => this.onChanges()));
    }

    fetch() {
        throw new Error("Nothing to fetch");
    }

    updateLocation() {
        throw new Error("No Location");
    }
}
