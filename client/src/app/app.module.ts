import { Injectable, NgModule } from '@angular/core';
import * as Hammer from 'hammerjs';
import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatCardModule } from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import { AbstractChartsComponent } from './abstract-charts/abstract-charts.component';
import { AbstractChartCardComponent } from './abstract-chart-card/abstract-chart-card.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AsideOptionsComponent } from './aside-options/aside-options.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


// --------------------------------------------------
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateSelectorService } from './date-selector/date-selector.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartHandlerMakerService } from './abstract-charts/chart-handler-maker.service';
import { NavigationService } from './main-nav/navigation.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NavRecordsKeeperService } from './nav-records/nav-records-keeper.service';
import { HelloRecorderService } from './nav-records/hello-recorder.service';
import { DateSelectorRecorderService } from './nav-records/date-selector-recorder.service';
import { NavRecordsAdBannerComponent } from './nav-records-ad-banner/nav-records-ad-banner.component';
import { NavRecordsAdDirective } from './nav-records-ad-banner/nav-records-ad.directive';
import { AsideOptionsService } from './aside-options/aside-options.service';
// import { IntervalChartsHandlerService } from './abstract-charts/chart-types/interval-charts-handler.service';
// import { TotalChartsHandlerService } from './abstract-charts/chart-types/total-charts-handler.service';
// import { RealtimeChartHandlerService } from './abstract-charts/chart-types/realtime-chart-handler.service';
import { CollegesComponent } from './editors/colleges/colleges.component';
import { PowersComponent } from './editors/powers/powers.component';
import { Sockets } from './sockets.module';
import { DateChartInitializerService } from './abstract-charts/chart-types/chart-initializers/date-chart-initializer.service';
import { OptionsChartInitializerService } from './abstract-charts/chart-types/chart-initializers/options-chart-initializer.service';
import { IntervalChartsHandlerService } from './abstract-charts/chart-types/interval-charts-handler.service';
import { SelectionChartInitializerService } from './abstract-charts/chart-types/chart-initializers/selection-chart-initializer.service';
import { TotalChartsHandlerService } from './abstract-charts/chart-types/total-charts-handler.service';
import { RealtimeChartHandlerService } from './abstract-charts/chart-types/realtime-chart-handler.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LogsModule } from './logs/logs.module';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthInterceptor } from './auth.interceptor';
import { ItemDeletorComponent } from './editors/recordable-comps/item-deletor/item-deletor.component';
import { ItemDeletorService } from './editors/recordable-comps/item-deletor/item-deletor.service';
import { ItemSubmitterComponent } from './editors/recordable-comps/item-submitter/item-submitter.component';
import { ItemSubmitterService } from './editors/recordable-comps/item-submitter/item-submitter.service';
import { AdminService } from './editors/admin/admin.service';
import { AdminComponent } from './editors/admin/admin.component';


@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
  };
}


@NgModule({
  declarations: [
    AppComponent,
    // SerialPowerDashboardsComponent,
    // SerialPowerDashboardCardComponent,
    // SerialPowerDashboardAreaComponent,
    // MultiChartsComponent,
    AbstractChartsComponent,
    AbstractChartCardComponent,
    // IntervalCollegeComponent,
    // IntervalPowerComponent,
    // TotalPowersComponent,
    AsideOptionsComponent,
    DateSelectorComponent,
    MainNavComponent,
    NavRecordsAdBannerComponent,
    NavRecordsAdDirective,
    CollegesComponent,
    PowersComponent,
    LoginComponent,
    LogoutComponent,
    ItemDeletorComponent,
    ItemSubmitterComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighchartsChartModule,
    MatCardModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    Sockets,
    LayoutModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    HammerModule,
    MatSlideToggleModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    LogsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DateSelectorService,
    ChartHandlerMakerService,
    NavigationService,
    NavRecordsKeeperService,
    HelloRecorderService,
    DateSelectorRecorderService,
    AsideOptionsService,
    IntervalChartsHandlerService,
    TotalChartsHandlerService,
    RealtimeChartHandlerService,
    DateChartInitializerService,
    OptionsChartInitializerService,
    ItemDeletorService,
    ItemSubmitterService,
    SelectionChartInitializerService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    AdminService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
