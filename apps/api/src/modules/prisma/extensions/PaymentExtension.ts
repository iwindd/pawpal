import {
  OrderStatus,
  Prisma,
  TransactionStatus,
} from '@/generated/prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger(`PaymentExtension`);

export const PaymentExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'paymentExtension',
    model: {
      userWalletTransaction: {
        failed: async (transactionId: string, failedBy: string) => {
          return await client.userWalletTransaction.update({
            where: {
              id: transactionId,
            },
            data: {
              status: TransactionStatus.FAILED,
              failedAt: new Date(),
              failedBy: {
                connect: {
                  id: failedBy,
                },
              },
            },
            select: {
              status: true,
              failedAt: true,
              failedBy: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
            },
          });
        },
        success: async (transactionId: string, succeededBy: string) => {
          return await client.userWalletTransaction.update({
            where: {
              id: transactionId,
            },
            data: {
              status: TransactionStatus.SUCCEEDED,
              succeededAt: new Date(),
              succeededBy: {
                connect: {
                  id: succeededBy,
                },
              },
            },
            select: {
              status: true,
              succeededAt: true,
              succeededBy: {
                select: {
                  id: true,
                  displayName: true,
                },
              },
            },
          });
        },
      },
      order: {
        complete: async (orderId: string, completedBy: string) => {
          return await client.order.update({
            where: {
              id: orderId,
              status: {
                in: [OrderStatus.PENDING, OrderStatus.CREATED],
              },
            },
            data: {
              status: OrderStatus.COMPLETED,
              completedAt: new Date(),
              completedBy: {
                connect: {
                  id: completedBy,
                },
              },
            },
          });
        },
        cancel: async (orderId: string, cancelledBy: string) => {
          return await client.order.update({
            where: {
              id: orderId,
              status: {
                in: [OrderStatus.PENDING, OrderStatus.CREATED],
              },
            },
            data: {
              status: OrderStatus.CANCELLED,
              cancelledAt: new Date(),
              cancelledBy: {
                connect: {
                  id: cancelledBy,
                },
              },
            },
          });
        },
        pending: async (orderId: string) => {
          return await client.order.update({
            where: {
              id: orderId,
              status: {
                in: [OrderStatus.CREATED],
              },
            },
            data: {
              status: OrderStatus.PENDING,
            },
          });
        },
      },
    },
  });
});
