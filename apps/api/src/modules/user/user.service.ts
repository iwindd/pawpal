import authConfig from '@/config/auth';
import { Injectable } from '@nestjs/common';
import { User } from '@pawpal/prisma';
import { RegisterInput } from '@pawpal/shared';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(user: RegisterInput): Promise<User> {
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
  }
}
