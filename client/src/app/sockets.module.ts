import { HttpClient } from '@angular/common/http';
import { Inject, isDevMode } from '@angular/core';
import { Injectable, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { DOCUMENT } from '@angular/common';


// if (isDevMode()) {
// }
// const

// const WS_URL = (isDevMode()) ? "http://localhost:3000/ws" : ;
    // super({ url: 'http://localhost:3000/ws/messages', options: {} });
    // super({ url: 'http://localhost:3000/ws/monitor', options: {} });


@Injectable()
export class MonitorSocket extends Socket {
  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    super({
      url: (document.domain.match('localhost') ? document.domain + ':3000' : document.domain)
        + '/ws/monitor',
      options: {}
    });

      console.log((document.domain.match('localhost') ? document.domain + ':3000' : document.domain)
        + '/ws/monitor');
  }
}

@Injectable()
export class MessagesSocket extends Socket {
  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    super({
      url: (document.domain.match('localhost') ? document.domain + ':3000' : document.domain)
        + '/ws/monitor',
      options: {}
    });
  }
}

@NgModule({
  declarations: [
    //components
  ],
  imports: [
    SocketIoModule,
    //...
  ],
  providers: [MonitorSocket, MessagesSocket],
})
export class Sockets {}
