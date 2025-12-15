import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';

import {
  OrderStatus,
  TransactionStatus,
  TransactionType,
} from '@/generated/prisma/enums';
import { TransactionStatusInput } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { UserWalletTransactionRepository } from './repositories/userWalletTransaction.repository';

@Injectable()
export class WalletService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userWalletTransactionRepo: UserWalletTransactionRepository,
  ) {}

  async successCharge(transactionId: string) {
    const transaction =
      await this.userWalletTransactionRepo.find(transactionId);

    await transaction.updateStatus(TransactionStatus.SUCCESS);
    await transaction.updateWalletBalance();

    switch (transaction.type) {
      case TransactionType.TOPUP: {
        await transaction.emitTopupTransactionUpdated();

        break;
      }
      case TransactionType.PURCHASE: {
        // TODO: handle purchase transaction

        break;
      }
      case TransactionType.TOPUP_FOR_PURCHASE: {
        await transaction.order.updateStatus(OrderStatus.PENDING);

        // create new purchase transaction
        await this.userWalletTransactionRepo.create({
          balance_before: transaction.balanceAfter,
          balance_after: transaction.order.total.minus(
            transaction.balanceAfter,
          ),
          type: TransactionType.PURCHASE,
          status: TransactionStatus.SUCCESS,
          wallet: {
            connect: {
              id: transaction.wallet.id,
            },
          },
          order: {
            connect: {
              id: transaction.order.id,
            },
          },
        });

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
    const transaction =
      await this.userWalletTransactionRepo.find(transactionId);

    await transaction.updateStatus(TransactionStatus.FAILED);
    await transaction.order?.updateStatus(OrderStatus.CANCELLED);
    transaction.emitTopupTransactionUpdated();
  }

  async pendingCharge(transactionId: string) {
    const transaction =
      await this.userWalletTransactionRepo.find(transactionId);

    await transaction.updateStatus(TransactionStatus.PENDING);
    transaction.emitNewJobTransaction();
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
