import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { UserType } from '@/generated/prisma/enums';
import { AuthService } from '@/modules/auth/auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';

const logger = new Logger('WsJwtAdminGuard');

@Injectable()
export class WsJwtAdminGuard implements CanActivate {
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

      if (user.userType !== UserType.EMPLOYEE)
        throw new UnauthorizedException('User is not employee');

      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}
