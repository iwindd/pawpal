import { Prisma, TransactionType } from '@/generated/prisma/client';
import { OrderRepository } from '../../modules/order/order.repository';

export type OrderEntityProps = Prisma.OrderGetPayload<{
  select: typeof OrderEntity.SELECT;
}>;

export class OrderEntity {
  constructor(
    private readonly order: OrderEntityProps,
    private readonly repo: OrderRepository,
  ) {}

  static get SELECT() {
    return {
      id: true,
      status: true,
      total: true,
      user_id: true,
      userWalletTransactions: {
        select: {
          id: true,
          type: true,
          status: true,
          balance_before: true,
          balance_after: true,
          wallet: {
            select: {
              balance: true,
              walletType: true,
            },
          },
        },
      },
    } satisfies Prisma.OrderSelect;
  }

  public get id() {
    return this.order.id;
  }

  public get total() {
    return this.order.total;
  }

  public get status() {
    return this.order.status;
  }

  public get userId() {
    return this.order.user_id;
  }

  public get transactions() {
    return this.order.userWalletTransactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      status: transaction.status,
      balanceBefore: transaction.balance_before,
      balanceAfter: transaction.balance_after,
      wallet: {
        balance: transaction.wallet.balance,
        walletType: transaction.wallet.walletType,
      },
    }));
  }

  public get purchaseTransaction() {
    return this.transactions.find(
      (transaction) => transaction.type === TransactionType.PURCHASE,
    );
  }
}
