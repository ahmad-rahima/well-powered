import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavRecordsAdDirective } from './nav-records-ad.directive';
import { NavRecordsKeeperService } from '../nav-records/nav-records-keeper.service';

@Component({
  selector: 'app-nav-records-ad-banner',
  templateUrl: './nav-records-ad-banner.component.html',
  styleUrls: ['./nav-records-ad-banner.component.scss']
})
export class NavRecordsAdBannerComponent implements OnInit {

  ads: any[] = [];
  @ViewChild(NavRecordsAdDirective, { static: true }) adHost!: NavRecordsAdDirective;

  constructor(
    private navRecordsKeeperService: NavRecordsKeeperService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.navRecordsKeeperService.recordsSubject.subscribe(item => {
      const viewContainerRef = this.adHost.viewContainerRef;
      let componentRef = viewContainerRef.createComponent(item);
      componentRef.location.nativeElement.setAttribute('id', item.name.toLowerCase());

    });

    this.router.events.subscribe(e => {
      const viewContainerRef = this.adHost.viewContainerRef;
      viewContainerRef.clear();
    });
  }

}
