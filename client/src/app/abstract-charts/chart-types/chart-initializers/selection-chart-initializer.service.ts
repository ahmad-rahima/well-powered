import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AsideOptionsService } from "src/app/aside-options/aside-options.service";
import { ChartInitializer } from "./chart-initializer";

@Injectable()
export class SelectionChartInitializerService implements ChartInitializer {
    route!: ActivatedRoute;

    constructor(
        private optionsService: AsideOptionsService
    ) {}

    on(route: ActivatedRoute) {
        this.route = route;
        return this;
    }

    run(): void {
        const { paramMap } = this.route.snapshot;
        const selectedId = paramMap.get('id') || '';
        this.optionsService.select(selectedId);
    }
}
