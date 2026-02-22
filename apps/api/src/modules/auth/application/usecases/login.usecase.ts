import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Session } from '@pawpal/shared';
import { UserRepository } from '../../../user/user.repository';

@Injectable()
export class LoginUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(email: string, password: string): Promise<Session> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('invalid_credentials');

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword)
      throw new UnauthorizedException('invalid_credentials');
    if (user.isSuspended) throw new UnauthorizedException('user_suspended');

    return user.toJSON();
  }
}
