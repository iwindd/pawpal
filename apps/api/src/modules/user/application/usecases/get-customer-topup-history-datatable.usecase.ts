import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { TransactionType } from '@/generated/prisma/enums';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetCustomerTopupHistoryDatatableUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, query: DatatableQuery) {
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
        wallet: {
          userId,
        },
        type: {
          not: TransactionType.PURCHASE,
        },
      },
    });
  }
}
