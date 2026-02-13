import { Prisma } from '@/generated/prisma/client';
import { TopupResponse } from '@pawpal/shared';

export class TopupResponseMapper {
  static get SELECT() {
    return {
      id: true,
      type: true,
      balanceBefore: true,
      balanceAfter: true,
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
      orderId: true,
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
        transaction.balanceAfter.minus(transaction.balanceBefore).toNumber(),
      ),
      balanceBefore: transaction.balanceBefore.toNumber(),
      balanceAfter: transaction.balanceAfter.toNumber(),
      status: transaction.status,
      currency: transaction.currency,
      payment: transaction.payment,
      orderId: transaction.orderId,
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
