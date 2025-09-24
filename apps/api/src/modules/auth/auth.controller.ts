import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import { SessionAuthGuard } from '@/common/guards/session-auth.guard';
import { LogoutInterceptor } from '@/common/interceptors/logout.interceptor';
import { TokenInterceptor } from '@/common/interceptors/token.interceptor';
import { ZodValidationPipe } from '@/common/ZodValidationPipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@pawpal/prisma';
import {
  type ChangeEmailInput,
  changeEmailSchema,
  type ChangePasswordInput,
  changePasswordSchema,
  type RegisterInput,
  registerSchema,
  type Session,
  type UpdateProfileInput,
  updateProfileSchema,
} from '@pawpal/shared';
import { AuthService } from './auth.service';

interface TestResponse {
  message: string;
  status: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  profile(@AuthUser() user: Session): Session {
    return user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  async login(@AuthUser() user: Session) {
    return user;
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LogoutInterceptor)
  async logout(@AuthUser() user: Session) {
    return null;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterInput,
  ): Promise<User> {
    return this.authService.register(body);
  }

  @Post('change-password')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @AuthUser() user: Session,
    @Body(new ZodValidationPipe(changePasswordSchema))
    body: ChangePasswordInput,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(user.id, body);
    return { message: 'Password changed successfully' };
  }

  @Post('change-email')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changeEmail(
    @AuthUser() user: Session,
    @Body(new ZodValidationPipe(changeEmailSchema))
    body: ChangeEmailInput,
  ): Promise<{ message: string }> {
    await this.authService.changeEmail(user.id, body);
    return { message: 'Email changed successfully' };
  }

  @Post('update-profile')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @AuthUser() user: Session,
    @Body(new ZodValidationPipe(updateProfileSchema))
    body: UpdateProfileInput,
  ): Promise<Session> {
    return this.authService.updateProfile(user.id, body);
  }

  @Get('admin/test')
  test(): TestResponse {
    return {
      message: 'Auth service is working correctly',
      status: 'success',
    };
  }
}
