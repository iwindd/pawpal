import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import authConfig from '@/config/auth';
import { Prisma, Role, User } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import {
  AdminCustomerResponse,
  AdminEmployeeResponse,
  ChangeEmailInput,
  ChangePasswordInput,
  DatatableResponse,
  RegisterInput,
  Session,
  UpdateProfileInput,
  WalletType,
} from '@pawpal/shared';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to find user by id or email ${id}:`, error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      this.logger.error(`Failed to find user by email ${email}:`, error);
      throw error;
    }
  }

  async create(user: RegisterInput): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(
        user.password,
        authConfig.bcryptSaltRounds,
      );

      return await this.prisma.user.create({
        data: {
          displayName: user.displayName,
          email: user.email,
          password: hashedPassword,
          avatar: null,
          userWallets: {
            create: {
              walletType: 'MAIN',
              balance: 0,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw error;
    }
  }

  async changePassword(
    userId: string,
    changePasswordData: ChangePasswordInput,
  ): Promise<void> {
    try {
      // First, get the user with password to verify old password
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, password: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify old password
      const isOldPasswordValid = await bcrypt.compare(
        changePasswordData.oldPassword,
        user.password,
      );
      if (!isOldPasswordValid) {
        throw new Error('invalid_old_password');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(
        changePasswordData.newPassword,
        authConfig.bcryptSaltRounds,
      );

      // Update password
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });
    } catch (error) {
      this.logger.error(`Failed to change password for user ${userId}:`, error);
      throw error;
    }
  }

  async changeEmail(
    userId: string,
    changeEmailData: ChangeEmailInput,
  ): Promise<Session> {
    try {
      // First, get the user with password to verify current password
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, password: true, email: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        changeEmailData.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new Error('invalid_password');
      }

      // Check if new email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: changeEmailData.newEmail },
      });

      if (existingUser) {
        throw new Error('email_already_exists');
      }

      // Update email
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { email: changeEmailData.newEmail },
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        avatar: updatedUser.avatar,
        createdAt: updatedUser.createdAt.toISOString(),
        userWallet: await this.getUserWallets(userId),
        roles: await this.getUserRoles(userId),
      };
    } catch (error) {
      this.logger.error(`Failed to change email for user ${userId}:`, error);
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    updateProfileData: UpdateProfileInput,
  ): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          displayName: updateProfileData.displayName,
          // TODO: Update avatar
        },
      });

      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update profile for user ${userId}:`, error);
      throw error;
    }
  }

  async getUserWallets(userId: string): Promise<Record<WalletType, number>> {
    const userWallets = await this.prisma.userWallet.findMany({
      where: { user_id: userId },
      select: {
        walletType: true,
        balance: true,
      },
    });

    return userWallets.reduce(
      (acc, wallet) => {
        acc[wallet.walletType] = Number(wallet.balance);
        return acc;
      },
      {} as Record<WalletType, number>,
    );
  }

  async getUserRoles(userId: string): Promise<Role['name'][]> {
    const roles = await this.prisma.role.findMany({
      where: { users: { some: { id: userId } } },
      select: { name: true },
    });
    return roles.map((role) => role.name);
  }

  async getUsers({
    skip,
    take,
    orderBy,
    search,
  }: DatatableQuery): Promise<DatatableResponse<AdminCustomerResponse>> {
    const where: Prisma.UserWhereInput = {
      roles: {
        some: {
          name: 'User',
        },
      },
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.user.count({ where });
    const users = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        email: true,
        displayName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userWallets: true,
            orders: true,
          },
        },
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      data: users.map((user) => ({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        roles: user.roles,
        walletCount: user._count.userWallets,
        orderCount: user._count.orders,
      })),
      total,
    };
  }

  async getEmployees({
    skip,
    take,
    orderBy,
    search,
  }: DatatableQuery): Promise<DatatableResponse<AdminEmployeeResponse>> {
    const where: Prisma.UserWhereInput = {
      roles: {
        some: {
          name: 'Admin',
        },
      },
    };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await this.prisma.user.count({ where });
    const users = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        email: true,
        displayName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userWallets: true,
            orders: true,
          },
        },
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      data: users.map((user) => ({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        roles: user.roles,
        walletCount: user._count.userWallets,
        orderCount: user._count.orders,
      })),
      total,
    };
  }
}
