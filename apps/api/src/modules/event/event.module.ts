import { WsJwtAdminGuard } from '@/common/guards/ws-jwt/ws-admin-jwt.guard';
import { WsJwtUserGuard } from '@/common/guards/ws-jwt/ws-user-jwt.guard';
import { SocketAuthAdminMiddleware } from '@/common/middlewares/SocketAuthAdminMiddleware';
import { SocketAuthUserMiddleware } from '@/common/middlewares/SocketAuthUserMiddleware';
import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EventService } from './application/event.service';
import { AdminEventGateway } from './presentation/admin-event.gateway';
import { UserEventGateway } from './presentation/user-event.gateway';

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
