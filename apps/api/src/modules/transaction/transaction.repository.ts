import { WalletEntity } from '@/common/entities/wallet.entity';
import {
  Prisma,
  TransactionStatus,
  TransactionType,
} from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { TransactionEntity } from '../../common/entities/transaction.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  private readonly logger = new Logger(TransactionRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get DEFAULT_SELECT() {
    return {
      ...TransactionEntity.SELECT,
    } satisfies Prisma.UserWalletTransactionSelect;
  }

  /**
   * Create a TransactionEntity from a Prisma.UserWalletTransactionGetPayload
   * @param transaction Prisma.UserWalletTransactionGetPayload
   * @returns TransactionEntity
   */
  public from(
    transaction: Prisma.UserWalletTransactionGetPayload<{
      select: typeof TransactionRepository.DEFAULT_SELECT;
    }>,
  ) {
    return new TransactionEntity(transaction, this);
  }

  /**
   * Find a transaction by id
   * @param args find first args
   * @returns TransactionEntity
   */
  public async find(transactionId: string) {
    const transaction =
      await this.prisma.userWalletTransaction.findFirstOrThrow({
        where: {
          id: transactionId,
        },
        select: TransactionRepository.DEFAULT_SELECT,
      });

    return this.from(transaction);
  }

  /**
   * Create a transaction
   * @param data transaction data
   * @returns created transaction
   */
  public async create(data: Prisma.UserWalletTransactionCreateInput) {
    const transaction = await this.prisma.userWalletTransaction.create({
      data,
      select: TransactionRepository.DEFAULT_SELECT,
    });

    return this.from(transaction);
  }

  /**
   * Update a transaction status
   * @param id transaction id
   * @param status transaction status
   * @returns updated transaction
   */
  public async updateStatusOrThrow(
    transactionId: string,
    transactionStatus: TransactionStatus,
  ) {
    this.logger.log(
      `Setting transaction ${transactionId} status to ${transactionStatus}`,
    );
    return this.prisma.userWalletTransaction.update({
      where: {
        id: transactionId,
      },
      data: {
        status: transactionStatus,
      },
    });
  }

  /**
   * Create a charge
   * @param amount amount
   * @param paymentGatewayId payment gateway id
   * @param orderId order id
   * @param wallet wallet
   * @param status status
   * @returns created transaction
   */
  public async createCharge(
    amount: Decimal,
    paymentGatewayId: string,
    orderId: string,
    wallet: WalletEntity,
    status: TransactionStatus = TransactionStatus.CREATED,
  ) {
    const type = orderId
      ? TransactionType.TOPUP_FOR_PURCHASE
      : TransactionType.TOPUP;

    const charge = await this.prisma.userWalletTransaction.create({
      data: {
        type,
        wallet: {
          connect: {
            id: wallet.id,
          },
        },
        payment: {
          connect: {
            id: paymentGatewayId,
          },
        },
        balance_before: wallet.balance,
        balance_after: wallet.balance.plus(amount),
        status,
        ...(orderId && { order: { connect: { id: orderId } } }),
      },
      select: TransactionRepository.DEFAULT_SELECT,
    });

    return this.from(charge);
  }
}
