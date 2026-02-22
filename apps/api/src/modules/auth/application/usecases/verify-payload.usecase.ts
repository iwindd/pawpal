import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { UserRepository } from '../../../user/infrastructure/user.repository';

@Injectable()
export class VerifyPayloadUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(payload: JwtPayload): Promise<Session> {
    const user = await this.userRepo.find(payload.sub);
    if (!user) throw new UnauthorizedException('invalid_credentials');
    if (user.isSuspended) throw new UnauthorizedException('user_suspended');
    return user.toJSON();
  }
}
