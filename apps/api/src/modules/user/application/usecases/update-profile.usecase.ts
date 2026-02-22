import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { Injectable } from '@nestjs/common';
import { UpdateProfileInput } from '@pawpal/shared';
import { UserRepository } from '../../infrastructure/user.repository';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    userId: string,
    payload: UpdateProfileInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    const user = await this.userRepo.find(userId);
    await user.updateProfile(payload, auditInfo);
    return user.toJSON();
  }
}
