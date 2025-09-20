import { Injectable } from '@nestjs/common';
import { prisma, User } from '@pawpal/prisma';

@Injectable()
export class UserService {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}
