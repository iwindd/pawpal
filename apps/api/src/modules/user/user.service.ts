import authConfig from '@/config/auth';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@pawpal/prisma';
import { RegisterInput } from '@pawpal/shared';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

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

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          displayName: true,
          coins: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to find user by id ${id}:`, error);
      throw error;
    }
  }
}
