import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@pawpal/prisma';
import { RegisterInput, Session } from '@pawpal/shared';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  /**
   * Verify the JWT payload
   * @param payload - The JWT payload
   * @returns The user
   */
  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;

    try {
      user = await this.userService.findByEmail(payload.sub);
      delete user.password;
    } catch (error) {
      Logger.error('Verify payload failed : ', error);
      throw new UnauthorizedException('invalid_credentials');
    }

    return user;
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException(`invalid_credentials`);
      }

      // TODO:: Compare password

      return user;
    } catch (error) {
      Logger.error('Login failed : ', error);
      throw new UnauthorizedException(`error`);
    }
  }

  async register(user: RegisterInput): Promise<{ user: User }> {
    const newUser = await this.userService.create(user);
    return { user: newUser };
  }

  signToken(user: Session): string {
    return this.jwtService.sign({
      sub: user.email,
    });
  }
}
