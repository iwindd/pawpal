import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { UserType } from '@/generated/prisma/enums';
import { ConflictException, Injectable } from '@nestjs/common';
import { AdminCreateUserInput } from '@pawpal/shared';
import { UserRepository } from '../../infrastructure/user.repository';

@Injectable()
export class AdminCreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(payload: AdminCreateUserInput, auditInfo?: PrismaAuditInfo) {
    if (await this.userRepo.isAlreadyExist(payload.email))
      throw new ConflictException('email_already_exists');

    const roleConnections =
      payload.type === 'employee' && payload.roles.length > 0
        ? payload.roles.map((id) => ({ id }))
        : [];

    const userType =
      payload.type == 'employee' ? UserType.EMPLOYEE : UserType.CUSTOMER;

    const user = await this.userRepo.create(
      {
        displayName: payload.displayName,
        email: payload.email,
        password: payload.password,
        roles: { connect: roleConnections },
        userType,
      },
      auditInfo,
    );

    return user.toJSON();
  }
}
