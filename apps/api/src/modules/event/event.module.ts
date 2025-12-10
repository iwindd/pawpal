import { WsJwtAdminGuard } from '@/common/guards/ws-jwt/ws-admin-jwt.guard';
import { WsJwtUserGuard } from '@/common/guards/ws-jwt/ws-user-jwt.guard';
import { SocketAuthAdminMiddleware } from '@/common/middlewares/SocketAuthAdminMiddleware';
import { SocketAuthUserMiddleware } from '@/common/middlewares/SocketAuthUserMiddleware';
import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventService } from './event.service';
import { AdminEventGateway } from './gateways/admin-event.gateway';
import { UserEventGateway } from './gateways/user-event.gateway';

@Global()
@Module({
  providers: [
    AdminEventGateway,
    UserEventGateway,
    EventService,
    SocketAuthUserMiddleware,
    SocketAuthAdminMiddleware,
    WsJwtAdminGuard,
    WsJwtUserGuard,
  ],
  exports: [EventService],
  imports: [AuthModule],
})
export class EventModule {}
