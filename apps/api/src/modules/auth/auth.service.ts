import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@pawpal/prisma';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    if (user && user.password === password) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: {
    email: string;
    password: string;
    displayName: string;
    coins: number;
  }): Promise<{ access_token: string }> {
    const payload = {
      email: user.email,
      password: user.password,
      displayName: user.displayName,
      coins: user.coins,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
