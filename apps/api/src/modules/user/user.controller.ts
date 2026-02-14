import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  type ChangeEmailInput,
  changeEmailSchema,
  type Session,
  type UpdateProfileInput,
  updateProfileSchema,
} from '@pawpal/shared';
import { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('change-email')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  changeEmail(
    @AuthUser() user: Session,
    @Body(new ZodPipe(changeEmailSchema))
    body: ChangeEmailInput,
    @Req() req: Request,
  ) {
    return this.userService.changeEmail(user.id, body, {
      performedById: user.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post('update-profile')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @AuthUser() user: Session,
    @Body(new ZodPipe(updateProfileSchema))
    body: UpdateProfileInput,
  ): Promise<Session> {
    return this.userService.updateProfile(user.id, body);
  }
}
