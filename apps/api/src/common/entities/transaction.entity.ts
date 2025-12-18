import { Prisma } from '@/generated/prisma/client';
import { TransactionRepository } from '@/modules/transaction/transaction.repository';
import { AdminTransactionResponse } from '@pawpal/shared';

export type TransactionEntityProps = Prisma.UserWalletTransactionGetPayload<{
  select: typeof TransactionEntity.SELECT;
}>;

export class TransactionEntity {
  constructor(
    private readonly transaction: TransactionEntityProps,
    private readonly repo: TransactionRepository,
  ) {}

  static get SELECT() {
    return {
      id: true,
      balance_after: true,
      balance_before: true,
      type: true,
      status: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      payment_gateway_id: true,
      order: {
        select: {
          id: true,
          total: true,
        },
      },
      wallet: {
        select: {
          id: true,
          user_id: true,
          walletType: true,
        },
      },
    } satisfies Prisma.UserWalletTransactionSelect;
  }

  get id() {
    return this.transaction.id;
  }

  get type() {
    return this.transaction.type;
  }

  get amount() {
    const diff = this.transaction.balance_after.minus(
      this.transaction.balance_before,
    );

    return diff.abs();
  }

  get status() {
    return this.transaction.status;
  }

  get balanceBefore() {
    return this.transaction.balance_before;
  }

  get balanceAfter() {
    return this.transaction.balance_after;
  }

  get userId() {
    return this.transaction.wallet.user_id;
  }

  get walletId() {
    return this.transaction.wallet.id;
  }

  get walletType() {
    return this.transaction.wallet.walletType;
  }

  get orderId() {
    return this.transaction.order.id;
  }

  get total() {
    return this.transaction.order.total;
  }

  public toJson(): AdminTransactionResponse {
    return {
      id: this.id,
      type: this.type,
      amount: Math.abs(this.balanceAfter.minus(this.balanceBefore).toNumber()),
      balance_before: this.balanceBefore.toNumber(),
      balance_after: this.balanceAfter.toNumber(),
      status: this.status,
      currency: this.transaction.currency,
      payment_gateway_id: this.transaction.payment_gateway_id,
      order_id: this.transaction.order.id,
      createdAt: this.transaction.createdAt.toISOString(),
      updatedAt: this.transaction.updatedAt.toISOString(),
    };
  }
}
