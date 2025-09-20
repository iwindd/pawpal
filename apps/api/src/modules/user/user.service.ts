import { Injectable } from '@nestjs/common';
import { prisma, User } from '@pawpal/prisma';
import { RegisterInput } from '@pawpal/shared';

@Injectable()
export class UserService {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async create(user: RegisterInput): Promise<User> {
    return await prisma.user.create({
      data: {
        displayName: user.displayName,
        email: user.email,
        password: user.password,
        coins: 0,
        avatar: null,
      },
    });
  }
}
