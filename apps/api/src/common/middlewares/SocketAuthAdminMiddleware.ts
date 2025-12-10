import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsJwtAdminGuard } from '../guards/ws-jwt/ws-admin-jwt.guard';

@Injectable()
export class SocketAuthAdminMiddleware {
  constructor(private readonly adminGuard: WsJwtAdminGuard) {}

  async use(socket: Socket, next: (err?: Error) => void) {
    try {
      const jwtPayload = socket.handshake.auth.jwtPayload;
      const user = await this.adminGuard.validate(jwtPayload);

      if (!user)
        return next(new Error('Unauthorized', { cause: 'Invalid token' }));

      socket.data.user = user;

      next();
    } catch (err) {
      next(new Error('Unauthorized', { cause: err }));
    }
  }
}
