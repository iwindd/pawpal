import { Prisma } from '@/generated/prisma/client';
import { TopupResponse } from '@pawpal/shared';

export class TopupResponseMapper {
  static get SELECT() {
    return {
      id: true,
      type: true,
      balance_before: true,
      balance_after: true,
      status: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      payment: {
        select: {
          id: true,
          label: true,
        },
      },
      order_id: true,
    } satisfies Prisma.UserWalletTransactionSelect;
  }

  static fromQuery(
    transaction: Prisma.UserWalletTransactionGetPayload<{
      select: typeof TopupResponseMapper.SELECT;
    }>,
  ): TopupResponse {
    return {
      id: transaction.id,
      type: transaction.type,
      amount: Math.abs(
        transaction.balance_after.minus(transaction.balance_before).toNumber(),
      ),
      balance_before: transaction.balance_before.toNumber(),
      balance_after: transaction.balance_after.toNumber(),
      status: transaction.status,
      currency: transaction.currency,
      payment: transaction.payment,
      order_id: transaction.order_id,
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
