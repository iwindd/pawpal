import { AuditInfo } from '@/common/decorators/audit.decorator';
import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { PrismaAuditInfo } from '@/common/interfaces/prisma-audit.interface';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  type ChangeEmailInput,
  changeEmailSchema,
  type Session,
  type UpdateProfileInput,
  updateProfileSchema,
} from '@pawpal/shared';
import { ChangeEmailUseCase } from '../application/usecases/change-email.usecase';
import { UpdateProfileUseCase } from '../application/usecases/update-profile.usecase';

@Controller('user')
export class UserController {
  constructor(
    private readonly changeEmail: ChangeEmailUseCase,
    private readonly updateProfile: UpdateProfileUseCase,
  ) {}

  @Post('change-email')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  changeEmailHandler(
    @AuthUser() user: Session,
    @Body(new ZodPipe(changeEmailSchema)) body: ChangeEmailInput,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.changeEmail.execute(user.id, body, auditInfo);
  }

  @Post('update-profile')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfileHandler(
    @AuthUser() user: Session,
    @Body(new ZodPipe(updateProfileSchema)) body: UpdateProfileInput,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ): Promise<Session> {
    return this.updateProfile.execute(user.id, body, auditInfo);
  }
}
