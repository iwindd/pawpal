import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GetSuspensionHistoryDatatableUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, query: DatatableQuery) {
    return this.prisma.userSuspension.getDatatable({
      query,
      where: { userId },
      select: {
        id: true,
        type: true,
        note: true,
        createdAt: true,
        performedBy: { select: { id: true, displayName: true } },
      },
    });
  }
}
