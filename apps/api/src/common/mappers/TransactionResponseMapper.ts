import { Prisma } from '@/generated/prisma/client';
import { AdminTransactionResponse } from '@pawpal/shared';

export class TransactionResponseMapper {
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
      payment_gateway_id: true,
      order_id: true,
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
        transaction.balance_after.minus(transaction.balance_before).toNumber(),
      ),
      balance_before: transaction.balance_before.toNumber(),
      balance_after: transaction.balance_after.toNumber(),
      status: transaction.status,
      currency: transaction.currency,
      payment_gateway_id: transaction.payment_gateway_id,
      order_id: transaction.order_id,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
    };
  }
}
