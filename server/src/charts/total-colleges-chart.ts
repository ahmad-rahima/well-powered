import { Chart } from './chart';

export function TotalCollegesChart(type: string, title: string, xAxis: any[], data: number[]) {
    Chart.call(this, type, title, xAxis, '', data);

    this.series = [];
    this.xAxis.categories = '-';
    this.yAxis.labels.format = '{value} k';

    this.tooltip = {};

    /* a college might have no conumption log, thus xAxis===null && data===null */
    if (xAxis) {
        xAxis.forEach((x, idx) => {
            let d = data[idx];

            this.series.push({
                data: [d],
                name: [x],
                fillOpacity: 0.5,
                color: Chart.colors.get(title),

                tooltip: {
                    headerFormat: `${title}<br>${x}<br>`,
                    pointFormat: `Consumption: {point.y} `,
                    valueSuffix: `k${Chart.units.get(title)}`,
                    valueDecimals: 2,
                }
            });
        });
    }
}
