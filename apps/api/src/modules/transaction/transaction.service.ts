import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { TransactionStatus, TransactionType } from '@/generated/prisma/enums';
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
   * @param processedBy processed by user id
   * @returns success charge transaction response
   */
  async successCharge(transactionId: string, processedBy: string) {
    const transaction = await this.transactionRepo.find(transactionId);

    if (transaction.type == TransactionType.PURCHASE)
      throw new Error('Transaction is not topup transaction');

    this.prisma.userWalletTransaction.success(transactionId, processedBy);

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
        await this.prisma.order.pending(transaction.orderId);

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
   * @param processedBy processed by user id
   */
  async failCharge(transactionId: string, processedBy: string) {
    const transaction = await this.transactionRepo.find(transactionId);

    this.prisma.userWalletTransaction.failed(transactionId, processedBy);

    // CANCELLED ORDER IF ORDER IS PENDING
    if (transaction.orderId)
      await this.prisma.order.cancel(transaction.orderId, processedBy);

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
      query: query,
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
    });
  }

  /**
   * Get order history datatable
   * @param user_id user id
   * @returns datatable response
   */
  async getOrderHistoryDatatable(user_id: string, query: DatatableQuery) {
    const result = await this.prisma.order.getDatatable({
      query: query,
      select: OrderResponseMapper.SELECT,
      where: {
        processedBy_id: user_id,
      },
    });

    return {
      data: result.data.map(OrderResponseMapper.fromQuery),
      total: result.total,
    };
  }

  /**
   * Get topup history datatable
   * @param user_id user id
   * @returns datatable response
   */
  async getTopupHistoryDatatable(user_id: string, query: DatatableQuery) {
    return this.prisma.userWalletTransaction.getDatatable({
      query: query,
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
      where: {
        processedBy_id: user_id,
        type: {
          not: TransactionType.PURCHASE,
        },
      },
    });
  }
}
