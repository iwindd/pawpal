import { TransactionFilterBuilder } from '@/common/filters/transactionFilter';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable, Logger } from '@nestjs/common';

import {
  PaymentGateway,
  UserWallet,
  UserWalletTransaction,
} from '@/generated/prisma/client';
import {
  TransactionStatus,
  TransactionType,
  WalletType,
} from '@/generated/prisma/enums';
import { TransactionStatusInput } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(private readonly prisma: PrismaService) {}

  private async getWalletOrCreate(
    userId: string,
    walletType: WalletType = WalletType.MAIN,
  ): Promise<UserWallet> {
    const userWallet = await this.prisma.userWallet.findFirst({
      where: {
        user_id: userId,
        walletType: walletType,
      },
    });

    if (!userWallet) {
      return this.prisma.userWallet.create({
        data: {
          user_id: userId,
          walletType: walletType,
          balance: 0,
        },
      });
    }

    return userWallet;
  }

  private async updateWalletBalance(
    wallet: UserWallet,
    amount: number,
  ): Promise<UserWallet> {
    return await this.prisma.userWallet.update({
      where: { id: wallet.id },
      data: { balance: Number(wallet.balance) + amount },
    });
  }

  private async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus,
  ): Promise<UserWalletTransaction> {
    return await this.prisma.userWalletTransaction.update({
      where: { id: transactionId },
      data: { status: status },
    });
  }

  async createCharge(
    userId: string,
    amount: number,
    paymentMethod: Pick<PaymentGateway, 'id'>,
    orderId?: string,
    walletType: WalletType = WalletType.MAIN,
  ) {
    const wallet = await this.getWalletOrCreate(userId, walletType);
    return await this.prisma.userWalletTransaction.create({
      data: {
        type: TransactionType.TOPUP,
        wallet_id: wallet.id,
        amount: amount,
        balance_before: wallet.balance,
        balance_after: Number(wallet.balance) + amount,
        status: TransactionStatus.PENDING,
        payment_gateway_id: paymentMethod.id,
        ...(orderId ? { order_id: orderId } : {}),
      },
      select: {
        id: true,
        type: true,
        amount: true,
        status: true,
        payment: {
          select: {
            id: true,
            metadata: true,
          },
        },
        createdAt: true,
      },
    });
  }

  async validateOrderProceed(orderId: string) {
    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id: orderId, status: 'PENDING_PAYMENT' },
      select: {
        id: true,
        user_id: true,
        total: true,
      },
    });
    const missingAmount = await this.getMissingAmount(
      +order.total,
      order.user_id,
    );

    if (missingAmount > 0) {
      return await this.prisma.order.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      });
    }

    return await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' },
    });
  }

  async successCharge(transactionId: string) {
    this.logger.log(`Success charge transaction ${transactionId}`);
    const transaction =
      await this.prisma.userWalletTransaction.findFirstOrThrow({
        where: { id: transactionId },
        select: {
          id: true,
          amount: true,
          wallet: true,
          order_id: true,
        },
      });

    const originalBalance = +transaction.wallet.balance;
    const updatedWallet = await this.updateWalletBalance(
      transaction.wallet,
      +transaction.amount,
    );

    const updatedTransaction = await this.updateTransactionStatus(
      transaction.id,
      TransactionStatus.SUCCESS,
    );

    if (transaction.order_id)
      await this.validateOrderProceed(transaction.order_id);

    return {
      transaction_id: updatedTransaction.id,
      balance_before: originalBalance,
      balance_after: +updatedWallet.balance,
      balance: +updatedWallet.balance,
    };
  }

  async failedCharge(transactionId: string) {
    const transaction = await this.updateTransactionStatus(
      transactionId,
      TransactionStatus.FAILED,
    );

    if (transaction.order_id) {
      await this.prisma.order.update({
        where: { id: transaction.order_id },
        data: { status: 'CANCELLED' },
      });
    }
  }

  async getMissingAmount(
    requiredAmount: number,
    userId: string,
    walletType: WalletType = WalletType.MAIN,
  ): Promise<number> {
    const wallet = await this.getWalletOrCreate(userId, walletType);
    const currentBalance = +wallet.balance;

    if (currentBalance >= requiredAmount) {
      return 0;
    }

    return requiredAmount - currentBalance;
  }

  async getPendingTransactions({
    skip,
    take,
    orderBy,
    search,
  }: DatatableQuery) {
    const where = new TransactionFilterBuilder()
      .onlyPendingStatus()
      .searchUser(search)
      .build();

    return {
      total: await this.prisma.userWalletTransaction.count({ where }),
      data: await this.prisma.userWalletTransaction.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
    };
  }

  changeTransactionStatus(
    transactionId: string,
    { status }: TransactionStatusInput,
  ) {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return this.successCharge(transactionId);
      case TransactionStatus.FAILED:
        return this.failedCharge(transactionId);
      default:
        throw new Error('Invalid status');
    }
  }
}
