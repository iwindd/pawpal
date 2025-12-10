import { WsJwtUserGuard } from '@/common/guards/ws-jwt/ws-user-jwt.guard';
import { SocketAuthUserMiddleware } from '@/common/middlewares/SocketAuthUserMiddleware';
import { UseGuards } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { BaseEventGateway } from '../../../common/classes/BaseEventGateway';
import { EventService } from '../event.service';

@WebSocketGateway({
  namespace: '/user',
})
@UseGuards(WsJwtUserGuard)
export class UserEventGateway extends BaseEventGateway {
  constructor(
    eventService: EventService,
    socketAuthUserMiddleware: SocketAuthUserMiddleware,
  ) {
    super(eventService.user, socketAuthUserMiddleware);
  }
}
