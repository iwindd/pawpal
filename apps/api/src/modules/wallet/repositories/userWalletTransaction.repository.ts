import { OrderEntity } from '@/common/entities/order.entity';
import { WalletEntity } from '@/common/entities/wallet.entity';
import { Prisma, TransactionStatus } from '@/generated/prisma/client';
import { EventService } from '@/modules/event/event.service';
import { OrderRepository } from '@/modules/order/order.repository';
import { Injectable, Logger } from '@nestjs/common';
import { UserWalletTransactionEntity } from '../../../common/entities/user-wallet-transaction.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletRepository } from './wallet.repository';

@Injectable()
export class UserWalletTransactionRepository {
  private readonly logger = new Logger(UserWalletTransactionRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRepo: WalletRepository,
    private readonly orderRepo: OrderRepository,
    private readonly eventService: EventService,
  ) {}

  static get DEFAULT_SELECT() {
    return {
      ...UserWalletTransactionEntity.SELECT,
      wallet: {
        select: WalletEntity.SELECT,
      },
      order: {
        select: OrderEntity.SELECT,
      },
    } satisfies Prisma.UserWalletTransactionSelect;
  }

  /**
   * Create a UserWalletTransactionEntity from a Prisma.UserWalletTransactionGetPayload
   * @param transaction Prisma.UserWalletTransactionGetPayload
   * @returns UserWalletTransactionEntity
   */
  public from(
    transaction: Prisma.UserWalletTransactionGetPayload<{
      select: typeof UserWalletTransactionRepository.DEFAULT_SELECT;
    }>,
  ) {
    return new UserWalletTransactionEntity(
      {
        id: transaction.id,
        balance_after: transaction.balance_after,
        balance_before: transaction.balance_before,
        type: transaction.type,
        status: transaction.status,
        wallet: this.walletRepo.from(transaction.wallet),
        order: transaction.order
          ? this.orderRepo.from(transaction.order)
          : null,
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
        select: UserWalletTransactionRepository.DEFAULT_SELECT,
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
      select: UserWalletTransactionRepository.DEFAULT_SELECT,
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
    return this.eventService.user.onTopupTransactionUpdated(
      transaction.wallet.userId,
      {
        id: transaction.id,
        status: transaction.status,
        balance: transaction.wallet.balance.toNumber(),
        walletType: transaction.wallet.walletType,
      },
    );
  }

  public async emitNewJobTransaction(transaction: UserWalletTransactionEntity) {
    if (transaction.status !== TransactionStatus.CREATED) return;

    return this.eventService.admin.onNewJobTransaction();
  }
}
