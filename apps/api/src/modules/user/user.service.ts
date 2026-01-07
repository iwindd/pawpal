import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangeEmailInput, UpdateProfileInput } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
  ) {}
  /**
   * Change user email
   * @param userId user id
   * @param payload change email payload
   * @returns user session
   */
  async changeEmail(userId: string, payload: ChangeEmailInput) {
    const isAlreadyExist = await this.userRepo.isAlreadyExist(payload.newEmail);

    if (isAlreadyExist) throw new ConflictException('email_already_exists');

    const user = await this.userRepo.find(userId);

    if (!user) throw new UnauthorizedException('invalid_credentials');

    const isValidPassword = await user.isValidPassword(payload.password);

    if (!isValidPassword)
      throw new UnauthorizedException('invalid_old_password');

    user.updateEmail(payload.newEmail);

    return user.toJSON();
  }

  /**
   * Update user profile
   * @param userId user id
   * @param updateProfileData update profile data
   * @returns user session
   */
  async updateProfile(userId: string, payload: UpdateProfileInput) {
    const user = await this.userRepo.find(userId);
    user.updateProfile(payload);

    return user.toJSON();
  }

  /**
   * Get user profile
   * @param userId user id
   * @returns user session
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatar: true,
        createdAt: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
        userWallets: {
          select: {
            walletType: true,
            balance: true,
          },
        },
      },
    });

    if (!user) return null;

    return user;
  }
}
