import { OrderResponseMapper } from '@/common/mappers/OrderResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import {
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from '@/generated/prisma/enums';
import { Injectable } from '@nestjs/common';
import { TransactionStatusInput } from '@pawpal/shared';
import { EventService } from '../event/event.service';
import { OrderRepository } from '../order/order.repository';
import { PrismaService } from '../prisma/prisma.service';
import { WalletRepository } from '../wallet/wallet.repository';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
    private readonly walletRepo: WalletRepository,
    private readonly orderRepo: OrderRepository,
    private readonly transactionRepo: TransactionRepository,
  ) {}

  async successCharge(transactionId: string) {
    const transaction = await this.transactionRepo.find(transactionId);
    this.transactionRepo.updateStatusOrThrow(
      transactionId,
      TransactionStatus.SUCCESS,
    );

    this.walletRepo.updateWalletBalanceOrThrow(
      transaction.amount,
      transaction.userId,
      transaction.walletType,
    );

    switch (transaction.type) {
      case TransactionType.TOPUP: {
        this.eventService.user.onTopupTransactionUpdated(transaction.userId, {
          id: transaction.id,
          status: transaction.status,
          balance: transaction.balanceAfter.toNumber(),
          walletType: transaction.walletType,
        });

        break;
      }
      case TransactionType.PURCHASE: {
        // TODO: handle purchase transaction

        break;
      }
      case TransactionType.TOPUP_FOR_PURCHASE: {
        await this.orderRepo.updateStatusOrThrow(
          transaction.orderId,
          OrderStatus.PENDING,
        );

        // create new purchase transaction
        await this.transactionRepo.create({
          balance_before: transaction.balanceAfter,
          balance_after: transaction.total.minus(transaction.balanceAfter),
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
      default:
        break;
    }

    return {
      transaction_id: transaction.id,
      balance_before: transaction.balanceBefore,
      balance_after: transaction.balanceAfter,
      balance: transaction.balanceAfter,
    };
  }

  async failedCharge(transactionId: string) {
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

    this.eventService.user.onTopupTransactionUpdated(transaction.userId, {
      id: transaction.id,
      status: transaction.status,
      balance: transaction.balanceAfter.toNumber(),
      walletType: transaction.walletType,
    });
  }

  async pendingCharge(transactionId: string) {
    const transaction = await this.transactionRepo.find(transactionId);

    await this.transactionRepo.updateStatusOrThrow(
      transactionId,
      TransactionStatus.PENDING,
    );

    this.eventService.admin.onNewJobTransaction(transaction.toJson());
  }

  /**
   * Get pending transactions datatable
   * @param query datatable query
   * @returns datatable response
   */
  async getPendingTransactionsDatatable(query: DatatableQuery) {
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
          status: TransactionStatus.PENDING,
          type: {
            not: TransactionType.PURCHASE,
          },
        },
      },
    });
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
      case TransactionStatus.PENDING:
        return this.pendingCharge(transactionId);
      default:
        throw new Error('Invalid status');
    }
  }
}
