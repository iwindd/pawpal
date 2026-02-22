import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { UserType } from '@/generated/prisma/enums';
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterInput, Session } from '@pawpal/shared';
import { UserRepository } from '../../../user/user.repository';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    payload: RegisterInput,
    auditInfo?: PrismaAuditInfo,
  ): Promise<Session> {
    if (await this.userRepo.isAlreadyExist(payload.email))
      throw new ConflictException('email_already_exists');

    const user = await this.userRepo.create(
      {
        displayName: payload.displayName,
        email: payload.email,
        password: payload.password,
        userType: UserType.CUSTOMER,
      },
      auditInfo,
    );

    return user.toJSON();
  }
}
