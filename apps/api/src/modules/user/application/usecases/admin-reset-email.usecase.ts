import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/user.repository';

@Injectable()
export class AdminResetEmailUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string, email: string, auditInfo?: PrismaAuditInfo) {
    const isAlreadyExist = await this.userRepo.isAlreadyExist(email);
    if (isAlreadyExist) throw new ConflictException('email_already_exists');

    await this.userRepo.updateEmail(userId, email, auditInfo);
    return { success: true };
  }
}
