import { WalletCollection } from '@/common/collections/wallet.collection';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AdminUserResponse,
  ChangeEmailInput,
  UpdateProfileInput,
} from '@pawpal/shared';
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
   * Admin reset user email
   * @param userId user id
   * @param email new email
   * @returns user session
   */
  async adminResetEmail(userId: string, email: string) {
    const isAlreadyExist = await this.userRepo.isAlreadyExist(email);

    if (isAlreadyExist) throw new ConflictException('email_already_exists');

    await this.userRepo.updateEmail(userId, email);

    return { success: true };
  }

  /**
   * Admin reset user password
   * @param userId user id
   * @param password new password
   * @returns user session
   */
  async adminResetPassword(userId: string, password: string) {
    await this.userRepo.updatePassword(userId, password);

    return { success: true };
  }

  /**
   * Get user profile
   * @param userId user id
   * @returns user session
   */
  async getProfile(userId: string): Promise<AdminUserResponse> {
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
        updatedAt: true,
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
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException('invalid_credentials');

    return {
      ...user,
      userWallet: WalletCollection.toObject(user.userWallets),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      walletCount: 0, // TODO: WHAT DA HELL IS THIS?
      orderCount: user._count.orders,
    };
  }
}
