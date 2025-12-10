import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { AuthService } from '@/modules/auth/auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';

const logger = new Logger('WsJwtUserGuard');

@Injectable()
export class WsJwtUserGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    if (context.getType() !== 'ws') return true;

    const client: Socket = context.switchToWs().getClient();
    const user = await this.validate(client.handshake.auth.jwtPayload);
    if (!user) return false;
    return true;
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.authService.verifyPayload(payload);

      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}
