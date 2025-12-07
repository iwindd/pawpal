import { Prisma, WalletType } from '@/generated/prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger(`WalletExtension`);

export const walletExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'walletExtension',
    model: {
      userWallet: {
        getWalletOrCreate: async (
          userId: string,
          walletType: WalletType = WalletType.MAIN,
        ) => {
          const userWallet = await client.userWallet.findFirst({
            where: {
              user_id: userId,
              walletType: walletType,
            },
          });

          if (!userWallet) {
            return client.userWallet.create({
              data: {
                user_id: userId,
                walletType: walletType,
                balance: 0,
              },
            });
          }

          return userWallet;
        },
        getMissingAmount: async (
          requiredAmount: number,
          userId: string,
          walletType: WalletType = WalletType.MAIN,
        ): Promise<number> => {
          const userWallet = await client.userWallet.findFirst({
            where: {
              user_id: userId,
              walletType: walletType,
            },
          });

          const userBalance = +userWallet?.balance || 0;

          return userBalance >= requiredAmount
            ? 0
            : requiredAmount - userBalance;
        },
        addWalletBalance: async (
          amount: number,
          userId: string,
          walletType: WalletType = WalletType.MAIN,
        ) => {
          logger.log(`Adding ${amount} to wallet ${userId} (${walletType})`);
          return client.userWallet.update({
            where: {
              user_id_walletType: {
                user_id: userId,
                walletType: walletType,
              },
            },
            data: {
              balance: {
                increment: amount,
              },
            },
          });
        },
        removeWalletBalance: async (
          amount: number,
          userId: string,
          walletType: WalletType = WalletType.MAIN,
        ) => {
          logger.log(
            `Removing ${amount} from wallet ${userId} (${walletType})`,
          );
          return client.userWallet.update({
            where: {
              user_id_walletType: {
                user_id: userId,
                walletType: walletType,
              },
            },
            data: {
              balance: {
                decrement: amount,
              },
            },
          });
        },
      },
    },
  });
});
