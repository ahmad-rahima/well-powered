import { Component, OnInit, OnDestroy } from '@angular/core';
import { debounceTime, EMPTY, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChartHandlerMakerService } from './chart-handler-maker.service';
import { NavigationService } from '../main-nav/navigation.service';


@Component({
  selector: 'app-abstract-charts',
  templateUrl: './abstract-charts.component.html',
  styleUrls: ['./abstract-charts.component.scss'],
})
export class AbstractChartsComponent implements OnInit, OnDestroy {

  chartOptions$!: Observable<any>;

  chartsHandler!: any;
  navObserver!: Subscription;
  chartType!: string;
  chartTarget!: string;

  constructor(
    public route: ActivatedRoute,
    private chartHandlerMaker: ChartHandlerMakerService,
    private navigationService: NavigationService,
  ) { }

  ngOnDestroy(): void {
    this.navObserver.unsubscribe();
  }

  ngOnInit(): void {
    this.init();

    // a HACK..? // wait until NavRecordsAdBannerComponent finishes clearing
    // here we wait 300 ms..
    this.navObserver = this.navigationService.chartsObserver
    .pipe(debounceTime(300))
    .subscribe(_ => {
      const { paramMap } = this.route.snapshot;
      const [crntChartType, crntChartTarget] = [
        paramMap.get('chartType'), paramMap.get('chartTarget')
      ];
      if (crntChartType === null) throw new Error('/:ChartType can\'t be null!');
      if (crntChartTarget === null) throw new Error('/:ChartTarget can\'t be null!');

      if (crntChartType === this.chartType &&
        crntChartTarget === this.chartTarget)
        return;

      this.chartType = crntChartType;
      this.chartTarget = crntChartTarget;
      if (this.chartsHandler)
        this.chartsHandler.onDestroy();
      this.chartOptions$ = EMPTY;
      this.init();
    });
  }

  init() {
    // make chart handler
    this.makeChartHandler();
    this.chartsHandler.onInit(this);
  }


  makeChartHandler() {
    const { paramMap } = this.route.snapshot;
    const chartType = paramMap.get('chartType') || '';
    const chartTarget = paramMap.get('chartTarget') || '';
    this.chartsHandler = this.chartHandlerMaker.make(chartType, chartTarget, this);
  }

}
