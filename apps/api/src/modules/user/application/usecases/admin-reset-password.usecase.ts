import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/user.repository';

@Injectable()
export class AdminResetPasswordUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string, password: string, auditInfo?: PrismaAuditInfo) {
    await this.userRepo.updatePassword(userId, password, auditInfo);
    return { success: true };
  }
}
