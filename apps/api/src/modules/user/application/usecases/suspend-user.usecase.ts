import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SuspendUserUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, adminId: string, note?: string) {
    return this.prisma.userSuspension.create({
      data: { userId: id, performedById: adminId, type: 'SUSPENDED', note },
    });
  }
}
