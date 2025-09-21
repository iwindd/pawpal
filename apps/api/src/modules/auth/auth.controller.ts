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
  type RegisterInput,
  registerSchema,
  type Session,
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
}
