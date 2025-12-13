import { TransactionFilterBuilder } from '@/common/filters/transactionFilter';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable, Logger } from '@nestjs/common';

import { PaymentGateway } from '@/generated/prisma/client';
import {
  OrderStatus,
  TransactionStatus,
  TransactionType,
  WalletType,
} from '@/generated/prisma/enums';
import { TransactionStatusInput } from '@pawpal/shared';
import { EventService } from '../event/event.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  async createCharge(
    userId: string,
    amount: number,
    paymentMethod: Pick<PaymentGateway, 'id'>,
    orderId?: string,
    walletType: WalletType = WalletType.MAIN,
  ) {
    const wallet = await this.prisma.userWallet.getWalletOrCreate(
      userId,
      walletType,
    );
    const charge = await this.prisma.userWalletTransaction.create({
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

    this.eventService.admin.emit('onNewJobTransaction');
    return charge;
  }

  async validateOrderProceed(orderId: string) {
    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id: orderId, status: OrderStatus.PENDING_PAYMENT },
      select: {
        id: true,
        user_id: true,
        total: true,
      },
    });

    const missingAmount = await this.prisma.userWallet.getMissingAmount(
      +order.total,
      order.user_id,
    );

    if (missingAmount > 0) {
      return await this.prisma.order.setStatus(order.id, OrderStatus.CANCELLED);
    }

    return await this.prisma.order.setStatus(order.id, OrderStatus.PAID);
  }

  async successCharge(transactionId: string) {
    const transaction =
      await this.prisma.userWalletTransaction.findFirstOrThrow({
        where: { id: transactionId },
        select: {
          id: true,
          amount: true,
          order_id: true,
          wallet: {
            select: {
              balance: true,
              user_id: true,
              walletType: true,
            },
          },
        },
      });

    const originalBalance = +transaction.wallet.balance;

    // update user wallet balance
    const updatedWallet = await this.prisma.userWallet.addWalletBalance(
      +transaction.amount,
      transaction.wallet.user_id,
      transaction.wallet.walletType,
    );

    // update transaction status
    const updatedTransaction =
      await this.prisma.userWalletTransaction.setStatus(
        transaction.id,
        TransactionStatus.SUCCESS,
      );

    // validate order proceed
    if (transaction.order_id)
      await this.validateOrderProceed(transaction.order_id);

    this.eventService.user.emitToUser(
      transaction.wallet.user_id,
      'onTopupTransactionUpdated',
      {
        id: updatedTransaction.id,
        status: updatedTransaction.status,
        balance: +updatedWallet.balance,
        walletType: transaction.wallet.walletType,
      },
    );

    return {
      transaction_id: updatedTransaction.id,
      balance_before: originalBalance,
      balance_after: +updatedWallet.balance,
      balance: +updatedWallet.balance,
    };
  }

  async failedCharge(transactionId: string) {
    const transaction = await this.prisma.userWalletTransaction.setStatus(
      transactionId,
      TransactionStatus.FAILED,
    );

    if (transaction.order_id)
      this.prisma.order.setStatus(transaction.order_id, OrderStatus.CANCELLED);

    this.eventService.user.emitToUser(
      transaction.wallet.user_id,
      'onTopupTransactionUpdated',
      {
        id: transaction.id,
        status: transaction.status,
        balance: +transaction.wallet.balance,
        walletType: transaction.wallet.walletType,
      },
    );
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
