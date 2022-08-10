import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Socket } from 'ngx-socket-io';
import { MonitorSocket } from '../sockets.module';

@Component({
  selector: 'app-abstract-chart-card',
  templateUrl: './abstract-chart-card.component.html',
  styleUrls: ['./abstract-chart-card.component.scss'],
})
export class AbstractChartCardComponent implements OnInit, OnDestroy {

  Highcharts = Highcharts;
  @Input() chartOptions!: any;

  constructor(
    private socket: MonitorSocket,
  ) { }

  ngOnDestroy(): void {
    if (this.collegeId && this.powerId) {
      this.socket.emit(`monitor-${this.collegeId}-${this.powerId}`);
    }
    // this.socket.removeAllListeners();
    
    // this.socket.disconnect();
  }

  ngOnInit(): void {
    // this.socket.connect();
    this.update(); // NOTE: only for real-time
  }

  collegeId: any;
  powerId: any;

  static MAX_LEN = 8;

  update() {
    let data: any[] = [];
    let { collegeId, powerId } = this.chartOptions;
    if (!(collegeId && powerId)) return;
    this.collegeId = collegeId;
    this.powerId = powerId;

    this.socket.emit('monitor', collegeId, powerId);
    this.socket.on(`monitor-${collegeId}-${powerId}`, (v: any) => {
      if (data.length > AbstractChartCardComponent.MAX_LEN)
        data.shift();
      data.push(v);
      let newCO = { ...this.chartOptions };
      newCO.series[0].data = data;
      this.chartOptions = newCO;
    });

  }
}
