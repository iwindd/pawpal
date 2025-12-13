import { Prisma, TransactionStatus } from '@/generated/prisma/client';
import { OrderEntity } from '@/modules/order/order.entity';
import {
  DEFAULT_WALLET_TRANSACTION_SELECT,
  UserWalletTransactionRepository,
} from '../repositories/userWalletTransaction.repository';
import { WalletEntity } from './wallet.entity';

export type UserWalletTransactionEntityProps =
  Prisma.UserWalletTransactionGetPayload<{
    select: Omit<typeof DEFAULT_WALLET_TRANSACTION_SELECT, 'wallet' | 'order'>;
  }> & {
    wallet: WalletEntity;
    order: OrderEntity;
  };

export class UserWalletTransactionEntity {
  constructor(
    private readonly userWalletTransaction: UserWalletTransactionEntityProps,
    private readonly repo: UserWalletTransactionRepository,
  ) {}

  get id() {
    return this.userWalletTransaction.id;
  }

  get wallet() {
    return this.userWalletTransaction.wallet;
  }

  get order() {
    return this.userWalletTransaction.order;
  }

  get type() {
    return this.userWalletTransaction.type;
  }

  get amount() {
    const diff = this.userWalletTransaction.balance_after.minus(
      this.userWalletTransaction.balance_before,
    );

    return diff.abs();
  }

  get status() {
    return this.userWalletTransaction.status;
  }

  get balanceBefore() {
    return this.userWalletTransaction.balance_before;
  }

  get balanceAfter() {
    return this.userWalletTransaction.balance_after;
  }

  public async updateStatus(status: TransactionStatus) {
    this.userWalletTransaction.status = status;

    return await this.repo.updateStatusOrThrow(
      this.userWalletTransaction.id,
      status,
    );
  }

  public async updateWalletBalance() {
    return await this.wallet.updateBalance(this.amount);
  }

  public async emitTopupTransactionUpdated() {
    return this.repo.emitTopupTransactionUpdated(this);
  }

  public async emitNewJobTransaction() {
    return this.repo.emitNewJobTransaction(this);
  }
}
