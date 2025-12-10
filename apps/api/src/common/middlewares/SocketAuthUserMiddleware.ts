import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsJwtUserGuard } from '../guards/ws-jwt/ws-user-jwt.guard';

@Injectable()
export class SocketAuthUserMiddleware {
  constructor(private readonly userGuard: WsJwtUserGuard) {}

  async use(socket: Socket, next: (err?: Error) => void) {
    try {
      const jwtPayload = socket.handshake.auth.jwtPayload;
      const user = await this.userGuard.validate(jwtPayload);

      if (!user)
        return next(new Error('Unauthorized', { cause: 'Invalid token' }));

      socket.data.user = user;

      next();
    } catch (err) {
      next(new Error('Unauthorized', { cause: err }));
    }
  }
}
