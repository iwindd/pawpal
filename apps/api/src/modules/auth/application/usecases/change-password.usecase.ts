import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ChangePasswordInput } from '@pawpal/shared';
import { UserRepository } from '../../../user/user.repository';

@Injectable()
export class ChangePasswordUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    userId: string,
    payload: ChangePasswordInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    const user = await this.userRepo.find(userId);
    if (!user) throw new UnauthorizedException('invalid_credentials');

    const isValidPassword = await user.isValidPassword(payload.oldPassword);
    if (!isValidPassword)
      throw new UnauthorizedException('invalid_old_password');

    user.updatePassword(payload.newPassword, auditInfo);
  }
}
