import { Chart } from './chart';

export function RealtimeChart(type: string, [title, subTitle]: [string, string]) {
    Chart.call(this, type, title, [], subTitle, []);

    const errPlot =  Chart.errs.get(title) ?
        Chart.errs.get(title).get(subTitle) :
        Chart.errs.get(subTitle).get(title);

    const warnPlot = Chart.warns.get(title) ?
        Chart.warns.get(title).get(subTitle) :
        Chart.warns.get(subTitle).get(title);

    this.yAxis.plotLines = [{
        color: Chart.errColor,
        value: errPlot,
        width: 3,
    },
    {
        color: Chart.warnColor,
        value: warnPlot,
        width: 3,
    }]

    this.series[0].color = Chart.colors.get(title) || Chart.colors.get(subTitle);
    this.tooltip.valueSuffix = 'k' + Chart.units.get(title) || Chart.units.get(subTitle);
}
