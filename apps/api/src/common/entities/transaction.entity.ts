import { Prisma } from '@/generated/prisma/client';
import { TransactionRepository } from '@/modules/transaction/transaction.repository';
import { AdminTransactionResponse } from '@pawpal/shared';
import { TransactionResponseMapper } from '../mappers/TransactionResponseMapper';

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
      balanceAfter: true,
      balanceBefore: true,
      type: true,
      status: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      paymentGatewayId: true,
      assignedId: true,
      assigned: {
        select: {
          id: true,
          displayName: true,
        },
      },
      assignedAt: true,
      order: {
        select: {
          id: true,
          total: true,
        },
      },
      wallet: {
        select: {
          id: true,
          userId: true,
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
    const diff = this.transaction.balanceAfter.minus(
      this.transaction.balanceBefore,
    );

    return diff.abs();
  }

  get status() {
    return this.transaction.status;
  }

  get balanceBefore() {
    return this.transaction.balanceBefore;
  }

  get balanceAfter() {
    return this.transaction.balanceAfter;
  }

  get userId() {
    return this.transaction.wallet.userId;
  }

  get walletId() {
    return this.transaction.wallet.id;
  }

  get walletType() {
    return this.transaction.wallet.walletType;
  }

  get orderId() {
    if (!this.transaction.order) {
      return null;
    }

    return this.transaction.order.id;
  }

  get total() {
    if (!this.transaction.order) {
      return null;
    }

    return this.transaction.order.total;
  }

  public toJson(): AdminTransactionResponse {
    return TransactionResponseMapper.fromQuery({
      ...this.transaction,
      orderId: this.orderId,
    });
  }
}
