import { WsJwtAdminGuard } from '@/common/guards/ws-jwt/ws-admin-jwt.guard';
import { SocketAuthAdminMiddleware } from '@/common/middlewares/SocketAuthAdminMiddleware';
import { UseGuards } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { BaseEventGateway } from '../../../common/classes/BaseEventGateway';
import { EventService } from '../event.service';

@WebSocketGateway({
  namespace: '/admin',
})
@UseGuards(WsJwtAdminGuard)
export class AdminEventGateway extends BaseEventGateway {
  constructor(
    eventService: EventService,
    socketAuthAdminMiddleware: SocketAuthAdminMiddleware,
  ) {
    super(eventService.admin, socketAuthAdminMiddleware);
  }
}
