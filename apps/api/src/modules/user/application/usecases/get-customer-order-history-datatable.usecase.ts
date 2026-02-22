import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCustomerOrderHistoryDatatableUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(user_id: string, query: DatatableQuery) {
    const result = await this.prisma.order.getDatatable({
      query: query,
      select: OrderResponseMapper.SELECT,
      where: {
        user_id,
      },
    });

    return {
      data: result.data.map(OrderResponseMapper.fromQuery),
      total: result.total,
    };
  }
}
