import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangeEmailInput } from '@pawpal/shared';
import { UserRepository } from '../../infrastructure/user.repository';

@Injectable()
export class ChangeEmailUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    userId: string,
    payload: ChangeEmailInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    const isAlreadyExist = await this.userRepo.isAlreadyExist(payload.newEmail);
    if (isAlreadyExist) throw new ConflictException('email_already_exists');

    const user = await this.userRepo.find(userId);
    if (!user) throw new UnauthorizedException('invalid_credentials');

    const isValidPassword = await user.isValidPassword(payload.password);
    if (!isValidPassword)
      throw new UnauthorizedException('invalid_old_password');

    await user.updateEmail(payload.newEmail, auditInfo);
    return user.toJSON();
  }
}
