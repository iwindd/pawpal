import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@pawpal/prisma';
import { RegisterInput, Session } from '@pawpal/shared';
import bcrypt from 'bcrypt';
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

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(`invalid_credentials`);
      }

      return user;
    } catch (error) {
      Logger.error('Login failed : ', error);
      throw new UnauthorizedException(`error`);
    }
  }

  async register(user: RegisterInput): Promise<User> {
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('email_already_exists');
    }

    const newUser = await this.userService.create(user);
    delete newUser.password;
    return newUser;
  }

  signToken(user: Session): string {
    return this.jwtService.sign({
      sub: user.email,
    });
  }
}
