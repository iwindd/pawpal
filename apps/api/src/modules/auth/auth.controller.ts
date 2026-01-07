import { AuthUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/auth/jwt-auth.guard';
import { LocalAuthGuard } from '@/common/guards/auth/local-auth.guard';
import { SessionAuthGuard } from '@/common/guards/auth/session-auth.guard';
import { LogoutInterceptor } from '@/common/interceptors/logout.interceptor';
import { TokenInterceptor } from '@/common/interceptors/token.interceptor';
import { ZodPipe } from '@/common/pipes/ZodPipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
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

  @Post('admin/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  async adminLogin(@AuthUser() user: Session) {
    if (!user.roles.includes('Admin'))
      throw new UnauthorizedException('user_not_admin');

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
  register(@Body(new ZodPipe(registerSchema)) body: RegisterInput) {
    return this.authService.register(body);
  }

  @Post('change-password')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  async changePassword(
    @AuthUser() user: Session,
    @Body(new ZodPipe(changePasswordSchema))
    body: ChangePasswordInput,
  ) {
    return this.authService.changePassword(user.id, body);
  }

  @Post('change-email')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  changeEmail(
    @AuthUser() user: Session,
    @Body(new ZodPipe(changeEmailSchema))
    body: ChangeEmailInput,
  ) {
    return this.authService.changeEmail(user.id, body);
  }

  @Post('update-profile')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @AuthUser() user: Session,
    @Body(new ZodPipe(updateProfileSchema))
    body: UpdateProfileInput,
  ): Promise<Session> {
    return this.authService.updateProfile(user.id, body);
  }
}
