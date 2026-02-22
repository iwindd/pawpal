import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetEmployeeProcessedOrderHistoryDatatableUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, query: DatatableQuery) {
    const result = await this.prisma.order.getDatatable({
      query,
      select: OrderResponseMapper.SELECT,
      where: {
        OR: [{ completedById: userId }, { cancelledById: userId }],
      },
    });
    return {
      data: result.data.map(OrderResponseMapper.fromQuery),
      total: result.total,
    };
  }
}
