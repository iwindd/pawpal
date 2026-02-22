import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { UserRepository } from '../../../user/infrastructure/user.repository';

@Injectable()
export class ImpersonateUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(id: string): Promise<Session> {
    const user = await this.userRepo.find(id);
    if (!user) throw new UnauthorizedException('invalid_user');
    if (user.isSuspended) throw new UnauthorizedException('user_suspended');
    return user.toJSON();
  }
}
