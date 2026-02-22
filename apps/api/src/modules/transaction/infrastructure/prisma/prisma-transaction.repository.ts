// removed WalletEntity import
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  Prisma,
  TransactionStatus,
  TransactionType,
} from '@/generated/prisma/client';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { Transaction } from '../../domain/entities/transaction';
import { ITransactionRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaTransactionRepository implements ITransactionRepository {
  private readonly logger = new Logger(PrismaTransactionRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get DEFAULT_SELECT() {
    return {
      id: true,
      balanceAfter: true,
      balanceBefore: true,
      type: true,
      status: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      paymentGatewayId: true,
      assignedId: true,
      assigned: {
        select: {
          id: true,
          displayName: true,
        },
      },
      assignedAt: true,
      order: {
        select: {
          id: true,
          total: true,
        },
      },
      wallet: {
        select: {
          id: true,
          userId: true,
          walletType: true,
        },
      },
    } satisfies Prisma.UserWalletTransactionSelect;
  }

  public from(
    transaction: Prisma.UserWalletTransactionGetPayload<{
      select: typeof PrismaTransactionRepository.DEFAULT_SELECT;
    }>,
  ): Transaction {
    return new Transaction(
      transaction.id,
      transaction.balanceAfter,
      transaction.balanceBefore,
      transaction.type as any,
      transaction.status as any,
      transaction.currency,
      transaction.createdAt,
      transaction.updatedAt,
      transaction.paymentGatewayId,
      transaction.assignedId,
      transaction.assigned,
      transaction.assignedAt,
      transaction.order,
      transaction.wallet as any,
    );
  }

  public async find(transactionId: string): Promise<Transaction> {
    const transaction =
      await this.prisma.userWalletTransaction.findFirstOrThrow({
        where: {
          id: transactionId,
        },
        select: PrismaTransactionRepository.DEFAULT_SELECT,
      });

    return this.from(transaction);
  }

  public async create(
    data: Prisma.UserWalletTransactionCreateInput,
  ): Promise<Transaction> {
    const transaction = await this.prisma.userWalletTransaction.create({
      data,
      select: PrismaTransactionRepository.DEFAULT_SELECT,
    });

    return this.from(transaction);
  }

  public async createCharge(
    amount: Decimal,
    paymentGatewayId: string,
    orderId: string,
    wallet: { id: string; balance: any },
    status: TransactionStatus = TransactionStatus.CREATED,
  ): Promise<Transaction> {
    const type = orderId
      ? TransactionType.TOPUP_FOR_PURCHASE
      : TransactionType.TOPUP;

    const charge = await this.prisma.userWalletTransaction.create({
      data: {
        type,
        wallet: { connect: { id: wallet.id } },
        payment: { connect: { id: paymentGatewayId } },
        amount,
        balanceBefore: wallet.balance,
        balanceAfter: wallet.balance.plus(amount),
        status,
        ...(orderId && { order: { connect: { id: orderId } } }),
      },
      select: PrismaTransactionRepository.DEFAULT_SELECT,
    });

    return this.from(charge);
  }

  public async getTransactionDetail(id: string): Promise<any> {
    const transaction =
      await this.prisma.userWalletTransaction.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          type: true,
          amount: true,
          balanceBefore: true,
          balanceAfter: true,
          status: true,
          currency: true,
          createdAt: true,
          confirmedAt: true,
          assignedAt: true,
          assigned: { select: { id: true, displayName: true } },
          failedAt: true,
          failedBy: { select: { id: true, displayName: true } },
          succeededAt: true,
          succeededBy: { select: { id: true, displayName: true } },
          wallet: {
            select: { user: { select: { id: true, displayName: true } } },
          },
          payment: { select: { name: true } },
        },
      });

    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      status: transaction.status,
      createdAt: transaction.createdAt,
      confirmedAt: transaction.confirmedAt,
      failedAt: transaction.failedAt,
      failedBy: transaction.failedBy,
      succeededAt: transaction.succeededAt,
      succeededBy: transaction.succeededBy,
      assigned: transaction.assigned,
      assignedAt: transaction.assignedAt,
      customer: transaction.wallet.user,
      paymentGateway: transaction.payment,
    };
  }

  public async successInstruction(
    transactionId: string,
    processedBy: string,
  ): Promise<any> {
    return this.prisma.userWalletTransaction.success(
      transactionId,
      processedBy,
    );
  }

  public async failInstruction(
    transactionId: string,
    processedBy: string,
  ): Promise<any> {
    return this.prisma.userWalletTransaction.failed(transactionId, processedBy);
  }

  public async setOrderPending(orderId: string): Promise<void> {
    await this.prisma.order.pending(orderId);
  }

  public async getOrderResponse(orderId: string): Promise<any> {
    return this.prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      select: (await import('@/common/mappers/OrderResponseMapper'))
        .OrderResponseMapper.SELECT,
    });
  }

  public async cancelOrder(
    orderId: string,
    processedBy: string,
  ): Promise<void> {
    await this.prisma.order.cancel(orderId, processedBy);
  }

  public async assignJob(
    transactionId: string,
    processedBy: string,
  ): Promise<any> {
    const transaction =
      await this.prisma.userWalletTransaction.findUniqueOrThrow({
        where: { id: transactionId },
        select: {
          assignedAt: true,
          assigned: { select: { id: true, displayName: true } },
        },
      });

    if (transaction.assigned) {
      if (transaction.assigned.id === processedBy) return transaction;
      throw new BadGatewayException(
        'Transaction is already assigned to someone else',
      );
    }

    return this.prisma.userWalletTransaction.update({
      where: { id: transactionId },
      data: {
        assignedId: processedBy,
        assignedAt: new Date(),
      },
      select: {
        assignedAt: true,
        assigned: { select: { id: true, displayName: true } },
      },
    });
  }

  public async getJobTransactionsDatatable(
    query: DatatableQuery,
  ): Promise<any> {
    delete query.skip;
    delete query.take;

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
        assignedId: true,
        assigned: { select: { id: true, displayName: true } },
        assignedAt: true,
      },
      where: {
        OR: [
          { status: TransactionStatus.PENDING },
          { status: TransactionStatus.CREATED },
        ],
        type: { not: TransactionType.PURCHASE },
      },
    });
  }
}
