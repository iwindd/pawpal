import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req: Request): Promise<{ email: string }> {
    console.log(req.user);
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Request): Promise<{ access_token: string }> {
    const { access_token } = await this.authService.login(req.user);
    return {
      access_token,
    };
  }
}
