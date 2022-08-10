import { Chart } from './chart';

export function IntervalChart(type: string, [title, subTitle]: [string, string], xAxis: any[], data: number[]) {
    let dates = xAxis.map(d => new Date(d).toLocaleDateString());
    Chart.call(this, type, title, dates, subTitle, data);

    this.series[0].color = Chart.colors.get(title) || Chart.colors.get(subTitle);
    this.tooltip.valueSuffix = Chart.units.get(title) || Chart.units.get(subTitle);
}
