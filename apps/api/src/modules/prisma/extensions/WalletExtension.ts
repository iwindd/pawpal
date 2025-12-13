import { Prisma } from '@/generated/prisma/client';
import { Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';

const logger = new Logger(`WalletExtension`);

export const walletExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'walletExtension',
    result: {
      userWalletTransaction: {
        amount: {
          needs: {
            balance_before: true,
            balance_after: true,
          },
          compute(userWalletTransaction: {
            balance_before: Decimal;
            balance_after: Decimal;
          }) {
            return Math.abs(
              Number(userWalletTransaction.balance_after) -
                Number(userWalletTransaction.balance_before),
            );
          },
        },
      },
    },
  });
});
