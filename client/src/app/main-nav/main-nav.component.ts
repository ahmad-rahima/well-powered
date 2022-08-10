import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, map, shareReplay } from 'rxjs/operators';
import { NavigationService } from './navigation.service';
import { NavRecordsKeeperService } from '../nav-records/nav-records-keeper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainNavComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationService,
    private navRecordsKeeperService: NavRecordsKeeperService,
    private router: Router,

    private swPush: SwPush,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.requestSubscription();
  }

  async requestSubscription() {

    if (!this.swPush.isEnabled) {
      console.warn('Notification are not enabled');
      return;
    }

    console.log('requesting..');
    let subscription = await this.swPush.requestSubscription({
      serverPublicKey: 'BDdsXfoyqlI5eggpuzH6Tsnd-nbbczV4u5s4lyP3wmHjYlDW_7Ye-Qgl-Uk7LBj5lrk7kqcySVlJcRwnEbbROSY'
    }).catch(err => console.log('Ooops got error: ', err));

    this.http.post('api/logs/register', subscription)
      .subscribe(_ => console.log('Notified successfully'), err => console.log('Error while notifying: ', err));
  }


  refreshCharts() {
    this.navigationService.refreshCharts();
  }

  onSwipeLeft($event: any) {
    console.log('event: ' + $event);

  }

  onSwipeRight($event: any) {

  }
}
