import authConfig from '@/config/auth';
import { Injectable } from '@nestjs/common';
import { prisma, User } from '@pawpal/prisma';
import { RegisterInput } from '@pawpal/shared';
import bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(user: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      user.password,
      authConfig.bcryptSaltRounds,
    );

    return await prisma.user.create({
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
