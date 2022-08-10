import { AbstractChartsComponent } from "../abstract-charts.component";

export interface ChartsHandler {
    onInit(charts: AbstractChartsComponent): void;
    onChanges(): void;
    onDestroy(): void;
}
