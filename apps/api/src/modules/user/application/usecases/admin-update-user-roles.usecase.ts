import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { Injectable, Logger } from '@nestjs/common';
import { AdminUpdateUserRoleInput } from '@pawpal/shared';
import { UserRepository } from '../../infrastructure/user.repository';

@Injectable()
export class AdminUpdateUserRolesUseCase {
  private readonly logger = new Logger(AdminUpdateUserRolesUseCase.name);
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    userId: string,
    payload: AdminUpdateUserRoleInput,
    auditInfo?: PrismaAuditInfo,
  ) {
    const roleConnections =
      payload.type === 'employee' && payload.roles.length > 0
        ? payload.roles.map((id) => ({ id }))
        : [{ name: 'User' }];

    this.logger.debug(`Updating user roles for ${userId}:`, roleConnections);
    const user = await this.userRepo.updateUserRoles(
      userId,
      roleConnections,
      auditInfo,
    );
    return user.toJSON();
  }
}
