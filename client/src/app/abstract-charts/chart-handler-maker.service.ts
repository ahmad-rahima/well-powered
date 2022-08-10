import { Injectable } from '@angular/core';
import { AbstractChartsComponent } from './abstract-charts.component';
import { IntervalChartsHandlerService } from './chart-types/interval-charts-handler.service';
import { RealtimeChartHandlerService } from './chart-types/realtime-chart-handler.service';
import { TotalChartsHandlerService } from './chart-types/total-charts-handler.service';


@Injectable()
export class ChartHandlerMakerService {
    constructor(
        private intervalCH: IntervalChartsHandlerService,
        private totalCH: TotalChartsHandlerService,
        private realtimeCH: RealtimeChartHandlerService
    ) {}

    make(chartType: string, chartTarget: string, charts: AbstractChartsComponent) {
        switch (chartType.toLowerCase()) {
                case 'interval':
                switch (chartTarget) {
                        default: return this.intervalCH;
                }

                case 'total':
                switch (chartTarget) {
                        default: return this.totalCH;
                }

                case 'monitor':
                switch (chartTarget) {
                        default: return this.realtimeCH;
                }
                default: break;
        }

        throw new Error(`ChartHandlerMakerService: could not make a chart handler!
${chartType.toLowerCase()}`);

    }
}
