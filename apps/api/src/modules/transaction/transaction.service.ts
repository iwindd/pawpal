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
   * Get transaction detail
   * @param id transaction id
   * @returns transaction detail
   */
  async getTransaction(id: string) {
    return await this.prisma.userWalletTransaction.findUniqueOrThrow({
      where: { id },
      include: {
        order: {
          include: {
            user: true,
          },
        },
        wallet: {
          include: {
            user: true,
          },
        },
        payment: true,
      },
    });
  }

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
          status: TransactionStatus.SUCCEEDED,
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
          amount: total,
          balanceBefore: transaction.balanceAfter,
          balanceAfter: total,
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
      transactionId: transaction.id,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
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
}
