import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'dgram';
import { map, Observable } from 'rxjs';
import { RealtimeConsumptionService } from './realtime-consumption.service';


@WebSocketGateway({
    cors: {
      origin: '*',

    },
    namespace: 'ws/monitor'
// { path: '/api/events' }
})
export class RealtimeConsumptionGateway {
  constructor(private realtimeConsumptionService: RealtimeConsumptionService) {}

  @SubscribeMessage('monitor')
  async monitor(@ConnectedSocket() socket: Socket, @MessageBody() data: any): Promise<Observable<number>> {
    let observe = this.realtimeConsumptionService.observe(data[0], data[1]);
    // return observe.pipe(map(x => ({ event: `monitor-${data[0]}-${data[1]}`, data: x })));
    let active = true;

    socket.on(`monitor-${data[0]}-${data[1]}`, () => {
      active = false;
    });

    return observe.pipe(map(x => {
      if (!active) throw new WsException('WebSocket stopped');
      return { event: `monitor-${data[0]}-${data[1]}`, data: x };
    }));
  }

}
