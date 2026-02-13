import { Prisma } from '@/generated/prisma/client';
import { AdminTransactionResponse } from '@pawpal/shared';

export class TransactionResponseMapper {
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
      paymentGatewayId: true,
      orderId: true,
    } satisfies Prisma.UserWalletTransactionSelect;
  }

  static fromQuery(
    transaction: Prisma.UserWalletTransactionGetPayload<{
      select: typeof TransactionResponseMapper.SELECT;
    }>,
  ): AdminTransactionResponse {
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
      paymentGatewayId: transaction.paymentGatewayId,
      orderId: transaction.orderId,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}
