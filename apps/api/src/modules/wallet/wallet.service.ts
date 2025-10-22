import { TransactionFilterBuilder } from '@/common/filters/transactionFilter';
import { WalletResponse } from '@/common/interfaces/wallet.interface';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';
import {
  TransactionStatus,
  TransactionType,
  UserWallet,
  UserWalletTransaction,
  WalletType,
} from '@pawpal/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
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

  private async createTransaction(
    wallet: UserWallet,
    amount: number,
    paymentMethod: string = 'unknown',
    transactionType: TransactionType = TransactionType.TOPUP,
  ): Promise<UserWalletTransaction> {
    return await this.prisma.userWalletTransaction.create({
      data: {
        wallet_id: wallet.id,
        amount: amount,
        balance_before: wallet.balance,
        balance_after: Number(wallet.balance) + amount,
        type: transactionType,
        payment_method: paymentMethod,
        status: TransactionStatus.SUCCESS,
      },
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
    orderId?: string,
    paymentMethod: string = 'unknown',
    walletType: WalletType = WalletType.MAIN,
  ): Promise<UserWalletTransaction> {
    const wallet = await this.getWalletOrCreate(userId, walletType);
    return await this.prisma.userWalletTransaction.create({
      data: {
        type: TransactionType.TOPUP,
        wallet_id: wallet.id,
        amount: amount,
        balance_before: wallet.balance,
        balance_after: Number(wallet.balance) + amount,
        payment_method: paymentMethod,
        status: TransactionStatus.PENDING,
        ...(orderId ? { order_id: orderId } : {}),
      },
    });
  }

  async createChargeIfMissingAmount(
    userId: string,
    amount: number,
    orderId?: string,
    paymentMethod: string = 'unknown',
    walletType: WalletType = WalletType.MAIN,
  ) {
    const missingAmount = await this.getMissingAmount(
      amount,
      userId,
      walletType,
    );
    if (missingAmount <= 0) return null;
    return this.createCharge(
      userId,
      missingAmount,
      orderId,
      paymentMethod,
      walletType,
    );
  }

  async successCharge(transactionId: string): Promise<WalletResponse> {
    const transaction = await this.prisma.userWalletTransaction.findUnique({
      where: { id: transactionId },
      select: {
        id: true,
        amount: true,
        wallet: true,
      },
    });

    if (!transaction) throw new Error('Transaction not found');

    const originalBalance = +transaction.wallet.balance;
    const updatedWallet = await this.updateWalletBalance(
      transaction.wallet,
      +transaction.amount,
    );

    const updatedTransaction = await this.updateTransactionStatus(
      transaction.id,
      TransactionStatus.SUCCESS,
    );

    return {
      transaction_id: updatedTransaction.id,
      balance_before: originalBalance,
      balance_after: +updatedWallet.balance,
      balance: +updatedWallet.balance,
    };
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
}
