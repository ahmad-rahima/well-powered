
Chart.colors = new Map<string, string>();
Chart.units = new Map<string, string>();

Chart.errs = new Map<string, any>();
Chart.errColor = "#FF0000";
Chart.warns = new Map<string, any>();
Chart.warnColor = "#FFFF00";


export function Chart(type: string, title: string, xAxis: any[], xTitle: string, data: number[]) {
    this.chart = { type };

    // this.caption = {};

    this.title = { text: title };

    // this.subtitle = { text: null };

    this.xAxis = { labels: { format: '{value}' }, title: { text: xTitle }, categories: xAxis };

    this.yAxis = {
        startOnTick: true,
        endOnTick: false,
        maxPadding: 0.35,
        labels: {
            format: '{value}k'
        },
    };

    this.tooltip = {
        headerFormat: `${title}<br>${xTitle}<br>`,
        pointFormat: 'Consumption: {point.y}',
        shared: true,
        valueDecimals: 2,
    };

    this.series = [{
        data,
        color: Chart.colors.get(title),
        fillOpacity: 0.5,
        name: `${title}`,
    }]
}
