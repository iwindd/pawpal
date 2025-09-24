import authConfig from '@/config/auth';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@pawpal/prisma';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  RegisterInput,
  UpdateProfileInput,
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
          coins: 0,
          avatar: null,
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
  ): Promise<void> {
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
      await this.prisma.user.update({
        where: { id: userId },
        data: { email: changeEmailData.newEmail },
      });
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
}
