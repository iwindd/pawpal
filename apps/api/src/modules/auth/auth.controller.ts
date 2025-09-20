import { ZodValidationPipe } from '@/common/ZodValidationPipe';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  RequestWithUser,
  Res,
  ResponseWithCookie,
  UseGuards,
} from '@nestjs/common';
import { RegisterInput, registerSchema, Session } from '@pawpal/shared';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(
    @Request() req: RequestWithUser,
  ): Promise<{ email: string; displayName: string; coins: number }> {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: RequestWithUser,
    @Res({ passthrough: true }) res: ResponseWithCookie,
  ): Promise<{ access_token: string; user: Session }> {
    const { access_token } = await this.authService.login(req.user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return {
      access_token,
      user: req.user,
    };
  }

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterInput,
  ) {
    const user = await this.authService.register(body);

    return user;
  }
}
