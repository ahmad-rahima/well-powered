import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SwPush } from "@angular/service-worker";
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Well Powered';

  constructor(
    private swPush: SwPush,
    private http: HttpClient,
    private authService: AuthService
  ) {

  }

  async ngOnInit() {
  }

  loggedIn() {
    return this.authService.isLoggedIn();
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


}
