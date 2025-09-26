import { WalletResponse } from '@/common/interfaces/wallet.interface';
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
      },
    });
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
}
