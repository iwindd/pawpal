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
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('change-email')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  changeEmail(
    @AuthUser() user: Session,
    @Body(new ZodPipe(changeEmailSchema)) body: ChangeEmailInput,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ) {
    return this.userService.changeEmail(user.id, body, auditInfo);
  }

  @Post('update-profile')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @AuthUser() user: Session,
    @Body(new ZodPipe(updateProfileSchema)) body: UpdateProfileInput,
    @AuditInfo() auditInfo: PrismaAuditInfo,
  ): Promise<Session> {
    return this.userService.updateProfile(user.id, body, auditInfo);
  }
}
