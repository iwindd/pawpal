import { Prisma } from '@/generated/prisma/client';
import { Logger } from '@nestjs/common';
import { TransactionStatus } from '@pawpal/shared';

const logger = new Logger(`TransactionExtension`);

export const TransactionExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'TransactionExtension',
    model: {
      userWalletTransaction: {
        setStatus: async (id: string, status: TransactionStatus) => {
          logger.log(`Setting transaction ${id} status to ${status}`);
          return client.userWalletTransaction.update({
            where: {
              id,
            },
            data: {
              status,
            },
            include: {
              wallet: {
                select: {
                  user_id: true,
                  balance: true,
                  walletType: true,
                },
              },
            },
          });
        },
      },
    },
  });
});
