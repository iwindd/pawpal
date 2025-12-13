import { Prisma, TransactionStatus } from '@/generated/prisma/client';
import { EventService } from '@/modules/event/event.service';
import {
  DEFAULT_ORDER_SELECT,
  OrderRepository,
} from '@/modules/order/order.repository';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserWalletTransactionEntity } from '../entities/user-wallet-transaction.entity';
import { DEFAULT_WALLET_SELECT, WalletRepository } from './wallet.repository';

export const DEFAULT_WALLET_TRANSACTION_SELECT = {
  id: true,
  balance_after: true,
  balance_before: true,
  type: true,
  status: true,
  wallet: {
    select: DEFAULT_WALLET_SELECT,
  },
  order: {
    select: DEFAULT_ORDER_SELECT,
  },
} satisfies Prisma.UserWalletTransactionSelect;

@Injectable()
export class UserWalletTransactionRepository {
  private readonly logger = new Logger(UserWalletTransactionRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRepo: WalletRepository,
    private readonly orderRepo: OrderRepository,
    private readonly eventService: EventService,
  ) {}

  /**
   * Create a UserWalletTransactionEntity from a Prisma.UserWalletTransactionGetPayload
   * @param transaction Prisma.UserWalletTransactionGetPayload
   * @returns UserWalletTransactionEntity
   */
  public from(
    transaction: Prisma.UserWalletTransactionGetPayload<{
      select: typeof DEFAULT_WALLET_TRANSACTION_SELECT;
    }>,
  ) {
    return new UserWalletTransactionEntity(
      {
        ...transaction,
        wallet: this.walletRepo.from(transaction.wallet),
        order: this.orderRepo.from(transaction.order),
      },
      this,
    );
  }

  /**
   * Find a transaction by id
   * @param args find first args
   * @returns UserWalletTransactionEntity
   */
  public async find(transactionId: string) {
    const transaction =
      await this.prisma.userWalletTransaction.findFirstOrThrow({
        where: {
          id: transactionId,
        },
        select: DEFAULT_WALLET_TRANSACTION_SELECT,
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
      select: DEFAULT_WALLET_TRANSACTION_SELECT,
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

  public async emitTopupTransactionUpdated(
    transaction: UserWalletTransactionEntity,
  ) {
    return this.eventService.user.emitToUser(
      transaction.wallet.userId,
      'onTopupTransactionUpdated',
      {
        id: transaction.id,
        status: transaction.status,
        balance: transaction.wallet.balance,
        walletType: transaction.wallet.walletType,
      },
    );
  }

  public async emitNewJobTransaction(transaction: UserWalletTransactionEntity) {
    if (transaction.status !== TransactionStatus.CREATED) return;

    return this.eventService.admin.emit('onNewJobTransaction');
  }
}
