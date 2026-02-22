import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { VerifyPayloadUseCase } from '@/modules/auth/application/usecases/verify-payload.usecase';
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
  constructor(private readonly verifyPayloadUseCase: VerifyPayloadUseCase) {}

  async canActivate(context: ExecutionContext) {
    if (context.getType() !== 'ws') return true;

    const client: Socket = context.switchToWs().getClient();
    const user = await this.validate(client.handshake.auth.jwtPayload);
    if (!user) return false;
    return true;
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.verifyPayloadUseCase.execute(payload);
      return user;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }
}
