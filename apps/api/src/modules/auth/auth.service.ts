import { Role, User } from '@/generated/prisma/client';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  RegisterInput,
  Session,
  UpdateProfileInput,
  WalletType,
} from '@pawpal/shared';
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
  async verifyPayload(payload: JwtPayload): Promise<Session> {
    let user: User;
    let wallet: Record<WalletType, number>;
    let roles: Role['name'][];
    try {
      user = await this.userService.findById(payload.sub);
      wallet = await this.userService.getUserWallets(user.id);
      roles = await this.userService.getUserRoles(user.id);
      delete user.password;
    } catch (error) {
      Logger.error('Verify payload failed : ', error);
      throw new UnauthorizedException('invalid_credentials');
    }

    return {
      ...user,
      userWallet: wallet,
      roles: roles,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async login(email: string, password: string): Promise<Session> {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException(`invalid_credentials`);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(`invalid_credentials`);
      }

      return {
        ...user,
        userWallet: await this.userService.getUserWallets(user.id),
        roles: await this.userService.getUserRoles(user.id),
        createdAt: user.createdAt.toISOString(),
      };
    } catch (error) {
      Logger.error('Login failed : ', error);
      throw new UnauthorizedException(`error`);
    }
  }

  async register(user: RegisterInput): Promise<Session> {
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('email_already_exists');
    }

    const newUser = await this.userService.create(user);
    delete newUser.password;
    return {
      ...newUser,
      userWallet: await this.userService.getUserWallets(newUser.id),
      roles: await this.userService.getUserRoles(newUser.id),
      createdAt: newUser.createdAt.toISOString(),
    };
  }

  signToken(user: Session): string {
    return this.jwtService.sign({
      sub: user.id,
    });
  }

  async changePassword(
    userId: string,
    changePasswordData: ChangePasswordInput,
  ): Promise<void> {
    try {
      await this.userService.changePassword(userId, changePasswordData);
    } catch (error) {
      if (error instanceof Error && error.message === 'invalid_old_password') {
        throw new BadRequestException('invalid_old_password');
      }
      if (error instanceof Error && error.message === 'User not found') {
        throw new UnauthorizedException('invalid_credentials');
      }
      Logger.error('Change password failed:', error);
      throw new BadRequestException('error');
    }
  }

  async changeEmail(userId: string, changeEmailData: ChangeEmailInput) {
    try {
      return await this.userService.changeEmail(userId, changeEmailData);
    } catch (error) {
      if (error instanceof Error && error.message === 'invalid_password') {
        throw new BadRequestException('invalid_password');
      }
      if (error instanceof Error && error.message === 'email_already_exists') {
        throw new ConflictException('email_already_exists');
      }
      if (error instanceof Error && error.message === 'User not found') {
        throw new UnauthorizedException('invalid_credentials');
      }
      Logger.error('Change email failed:', error);
      throw new BadRequestException('error');
    }
  }

  async updateProfile(
    userId: string,
    updateProfileData: UpdateProfileInput,
  ): Promise<Session> {
    try {
      const updatedUser = await this.userService.updateProfile(
        userId,
        updateProfileData,
      );
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        avatar: updatedUser.avatar,
        createdAt: updatedUser.createdAt.toISOString(),
        userWallet: await this.userService.getUserWallets(userId),
        roles: await this.userService.getUserRoles(userId),
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        throw new UnauthorizedException('invalid_credentials');
      }
      Logger.error('Update profile failed:', error);
      throw new BadRequestException('error');
    }
  }
}
