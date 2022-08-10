import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AsideOptionsService } from "src/app/aside-options/aside-options.service";
import { ChartInitializer } from "./chart-initializer";

@Injectable()
export class OptionsChartInitializerService implements ChartInitializer {
    route!: ActivatedRoute;

    constructor(
        private http: HttpClient,
        private asideOptionsService: AsideOptionsService
    ) {}

    on(route: ActivatedRoute) {
        this.route = route;
        return this;
    }

    run(): void {
        const chartTarget = this.route.snapshot.paramMap.get('chartTarget');
        const options$ = this.http.get(`api/${chartTarget}s`);
        this.asideOptionsService.take(options$);
    }
}
