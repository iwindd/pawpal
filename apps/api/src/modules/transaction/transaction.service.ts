import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from '@/generated/prisma/enums';
import { Injectable, Logger } from '@nestjs/common';
import { EventService } from '../event/event.service';
import { OrderRepository } from '../order/order.repository';
import { PrismaService } from '../prisma/prisma.service';
import { WalletRepository } from '../wallet/wallet.repository';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
    private readonly walletRepo: WalletRepository,
    private readonly orderRepo: OrderRepository,
    private readonly transactionRepo: TransactionRepository,
  ) {}

  /**
   * Success charge transaction
   * @param transactionId transaction id
   * @returns success charge transaction response
   */
  async successCharge(transactionId: string) {
    const transaction = await this.transactionRepo.find(transactionId);

    if (transaction.type == TransactionType.PURCHASE)
      throw new Error('Transaction is not topup transaction');

    this.transactionRepo.updateStatusOrThrow(
      transactionId,
      TransactionStatus.SUCCESS,
    );

    switch (transaction.type) {
      case TransactionType.TOPUP: {
        this.walletRepo.updateWalletBalanceOrThrow(
          transaction.balanceAfter,
          transaction.userId,
          transaction.walletType,
        );

        this.eventService.admin.onFinishedJobTransaction(transaction.toJson());
        this.eventService.user.onTopupTransactionUpdated(transaction.userId, {
          id: transaction.id,
          status: TransactionStatus.SUCCESS,
          balance: transaction.balanceAfter.toNumber(),
          walletType: transaction.walletType,
        });

        break;
      }
      case TransactionType.TOPUP_FOR_PURCHASE: {
        await this.orderRepo.updateStatusOrThrow(
          transaction.orderId,
          OrderStatus.PENDING,
        );

        // create new purchase transaction
        const total = transaction.total.minus(transaction.balanceAfter).abs();
        await this.transactionRepo.create({
          balance_before: transaction.balanceAfter,
          balance_after: total,
          type: TransactionType.PURCHASE,
          status: TransactionStatus.PENDING,
          wallet: {
            connect: {
              id: transaction.walletId,
            },
          },
          order: {
            connect: {
              id: transaction.orderId,
            },
          },
        });

        this.walletRepo.updateWalletBalanceOrThrow(
          total,
          transaction.userId,
          transaction.walletType,
        );

        const order = await this.prisma.order.findUniqueOrThrow({
          where: {
            id: transaction.orderId,
          },
          select: OrderResponseMapper.SELECT,
        });

        this.eventService.admin.onNewJobOrder(
          OrderResponseMapper.fromQuery(order),
        );

        break;
      }
    }

    return {
      transaction_id: transaction.id,
      balance_before: transaction.balanceBefore,
      balance_after: transaction.balanceAfter,
      balance: transaction.balanceAfter,
    };
  }

  /**
   * Failed charge transaction
   * @param transactionId transaction id
   */
  async failCharge(transactionId: string) {
    const transaction = await this.transactionRepo.find(transactionId);

    await this.transactionRepo.updateStatusOrThrow(
      transaction.id,
      TransactionStatus.FAILED,
    );

    // CANCELLED ORDER IF ORDER IS PENDING
    if (transaction.orderId)
      await this.orderRepo.updateStatusOrThrow(
        transaction.orderId,
        OrderStatus.CANCELLED,
      );

    this.eventService.admin.onFinishedJobTransaction(transaction.toJson());
    this.eventService.user.onTopupTransactionUpdated(transaction.userId, {
      id: transaction.id,
      status: TransactionStatus.FAILED,
      balance: transaction.balanceBefore.toNumber(),
      walletType: transaction.walletType,
    });
  }

  /**
   * Get pending transactions datatable
   * @param query datatable query
   * @returns datatable response
   */
  async getJobTransactionsDatatable(query: DatatableQuery) {
    delete query.skip;
    delete query.take;

    return this.prisma.userWalletTransaction.getDatatable({
      select: {
        id: true,
        type: true,
        amount: true,
        balance_before: true,
        balance_after: true,
        status: true,
        currency: true,
        payment_gateway_id: true,
        order_id: true,
        createdAt: true,
        updatedAt: true,
      },
      query: {
        ...query,
        where: {
          OR: [
            {
              status: TransactionStatus.PENDING,
            },
            {
              status: TransactionStatus.CREATED,
            },
          ],
          type: {
            not: TransactionType.PURCHASE,
          },
        },
      },
    });
  }
}
