import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { TransactionType } from '@/generated/prisma/enums';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get employee datatable
   * @param query
   * @returns
   */
  async getEmployeeDatatable(query: DatatableQuery) {
    return this.prisma.user.getDatatable({
      query: query,
      where: {
        roles: {
          some: {
            name: 'Admin',
          },
        },
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            userWallets: true,
            orders: true,
          },
        },
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      searchable: {
        email: { mode: 'insensitive' },
        displayName: { mode: 'insensitive' },
      },
    });
  }

  /**
   * Get topup history datatable
   * @param userId user id
   * @returns datatable response
   */
  async getProcessedTopupHistoryDatatable(
    userId: string,
    query: DatatableQuery,
  ) {
    return this.prisma.userWalletTransaction.getDatatable({
      query: query,
      select: {
        id: true,
        type: true,
        amount: true,
        balanceBefore: true,
        balanceAfter: true,
        status: true,
        currency: true,
        paymentGatewayId: true,
        orderId: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        OR: [
          {
            succeededById: userId,
          },
          {
            failedById: userId,
          },
        ],
        type: {
          not: TransactionType.PURCHASE,
        },
      },
    });
  }

  /**
   * Get order history datatable
   * @param userId user id
   * @returns datatable response
   */
  async getProcessedOrderHistoryDatatable(
    userId: string,
    query: DatatableQuery,
  ) {
    const result = await this.prisma.order.getDatatable({
      query: query,
      select: OrderResponseMapper.SELECT,
      where: {
        OR: [
          {
            completedById: userId,
          },
          {
            cancelledById: userId,
          },
        ],
      },
    });

    return {
      data: result.data.map(OrderResponseMapper.fromQuery),
      total: result.total,
    };
  }
}
