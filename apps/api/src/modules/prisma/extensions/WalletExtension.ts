import { Prisma, WalletType } from '@/generated/prisma/client';
import { Logger } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';

const logger = new Logger(`WalletExtension`);

export const walletExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'walletExtension',
    model: {
      userWallet: {
        updateWalletBalanceOrThrow: async (
          amount: number | DecimalJsLike,
          userId: string,
          walletType: WalletType = WalletType.MAIN,
        ) => {
          logger.log(`Setting ${+amount} to wallet ${userId} (${walletType})`);
          return client.userWallet.update({
            where: {
              user_id_walletType: {
                user_id: userId,
                walletType: walletType,
              },
            },
            data: {
              balance: amount,
            },
          });
        },
      },
    },
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
