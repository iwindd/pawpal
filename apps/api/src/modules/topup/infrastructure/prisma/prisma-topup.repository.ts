import { TopupResponseMapper } from '@/common/mappers/TopupResponseMapper';
import { TransactionResponseMapper } from '@/common/mappers/TransactionResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Prisma } from '@/generated/prisma/client';
import { TransactionStatus, TransactionType } from '@/generated/prisma/enums';
import { Injectable } from '@nestjs/common';
import { TopupStatus } from '@pawpal/shared';
import { PrismaService } from '../../../prisma/prisma.service';
import { ITopupRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaTopupRepository implements ITopupRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async getTopupHistoryDatatable(
    userId: string,
    query: DatatableQuery,
    statusFilter?: TopupStatus,
  ) {
    const where: Prisma.UserWalletTransactionWhereInput = {
      wallet: {
        userId,
      },
      orderId: null,
    };

    if (statusFilter) {
      where.status = statusFilter;
    }

    const datatable = await this.prisma.userWalletTransaction.getDatatable({
      query,
      where,
      select: TopupResponseMapper.SELECT,
    });

    return {
      data: datatable.data.map(TopupResponseMapper.fromQuery),
      total: datatable.total,
    };
  }

  public async createCharge(
    userId: string,
    amount: any,
    paymentGatewayId: string,
    walletId: string,
    walletBalance: any,
    orderId?: string,
    status: TransactionStatus | string = TransactionStatus.CREATED,
  ) {
    const type = orderId
      ? TransactionType.TOPUP_FOR_PURCHASE
      : TransactionType.TOPUP;

    const charge = await this.prisma.userWalletTransaction.create({
      data: {
        type,
        wallet: { connect: { id: walletId } },
        payment: { connect: { id: paymentGatewayId } },
        amount,
        balanceBefore: walletBalance,
        balanceAfter: walletBalance.plus(amount),
        status: status as TransactionStatus,
        ...(orderId && { order: { connect: { id: orderId } } }),
      },
      select: {
        ...TransactionResponseMapper.SELECT,
        amount: true,
        payment: {
          select: {
            id: true,
            metadata: true,
            label: true,
          },
        },
      },
    });

    return charge;
  }

  public async confirm(chargeId: string) {
    const charge = await this.prisma.userWalletTransaction.update({
      where: {
        id: chargeId,
        status: TransactionStatus.CREATED,
      },
      data: {
        status: TransactionStatus.PENDING,
        confirmedAt: new Date(),
      },
      select: TransactionResponseMapper.SELECT,
    });

    return TransactionResponseMapper.fromQuery(charge);
  }
}
