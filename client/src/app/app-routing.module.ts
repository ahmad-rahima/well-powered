import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbstractChartsComponent } from './abstract-charts/abstract-charts.component';
import { AppGuard } from './app.guard';
import { CollegesComponent } from './editors/colleges/colleges.component';
import { PowersComponent } from './editors/powers/powers.component';
import { LoginComponent } from './login/login.component';
import { LogsComponent } from './logs/logs.component';
// import { AppComponent } from './app.component';
// import { IntervalCollegeComponent } from './interval-college/interval-college.component';
// import { IntervalPowerComponent } from './interval-power/interval-power.component';
// import { TotalPowersComponent } from './total-powers/total-powers.component';
// import { SerialPowerDashboardsComponent } from './serial-power-dashboards/serial-power-dashboards.component';


const routes: Routes = [


  { path: '', canActivate: [AppGuard], children: [
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'logs', component: LogsComponent, pathMatch: 'full'},

    { path: 'powers', component: PowersComponent, pathMatch: 'full' },
    { path: 'powers/:id', component: PowersComponent, pathMatch: 'full' },
    { path: 'colleges', component: CollegesComponent, pathMatch: 'full' },
    { path: 'colleges/:id', component: CollegesComponent, pathMatch: 'full' },

    { path: 'charts/:chartType/:chartTarget', component: AbstractChartsComponent, pathMatch: 'full' },
    { path: 'charts/:chartType/:chartTarget/:id', component: AbstractChartsComponent, pathMatch: 'full' },
    { path: 'charts/:chartType/:chartTarget/:id/days/:start/:end', component: AbstractChartsComponent, pathMatch: 'full' },
    { path: 'charts/:chartType/:chartTarget/days/:start/:end', component: AbstractChartsComponent, pathMatch: 'full' },
  ]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
