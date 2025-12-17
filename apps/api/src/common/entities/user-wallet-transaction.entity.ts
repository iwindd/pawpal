import { OrderEntity } from '@/common/entities/order.entity';
import { Prisma, TransactionStatus } from '@/generated/prisma/client';
import { UserWalletTransactionRepository } from '../../modules/wallet/repositories/userWalletTransaction.repository';
import { WalletEntity } from './wallet.entity';

export type UserWalletTransactionEntityProps =
  Prisma.UserWalletTransactionGetPayload<{
    select: typeof UserWalletTransactionEntity.SELECT;
  }> & {
    wallet: WalletEntity;
    order: OrderEntity;
  };

export class UserWalletTransactionEntity {
  constructor(
    private readonly userWalletTransaction: UserWalletTransactionEntityProps,
    private readonly repo: UserWalletTransactionRepository,
  ) {}

  static get SELECT() {
    return {
      id: true,
      balance_after: true,
      balance_before: true,
      type: true,
      status: true,
    } satisfies Prisma.UserWalletTransactionSelect;
  }

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

  public toJson() {
    return {
      id: this.id,
      balanceBefore: this.balanceBefore,
      balanceAfter: this.balanceAfter,
      type: this.type,
      amount: this.amount,
      status: this.status,
    };
  }
}
