import { Injectable, NgModule } from '@angular/core';
import { Socket, SocketIoModule } from 'ngx-socket-io';

@Injectable()
export class MonitorSocket extends Socket {
  constructor() {
    super({ url: 'http://localhost:3000/ws/monitor', options: {} });
  }
}

@Injectable()
export class MessagesSocket extends Socket {
  constructor() {
    super({ url: 'http://localhost:3000/ws/messages', options: {} });
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
