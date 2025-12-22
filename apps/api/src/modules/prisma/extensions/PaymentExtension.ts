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
        failed: async (transactionId: string, processedBy: string) => {
          return await client.userWalletTransaction.update({
            where: {
              id: transactionId,
            },
            data: {
              status: TransactionStatus.FAILED,
              processedAt: new Date(),
              processedBy: {
                connect: {
                  id: processedBy,
                },
              },
            },
          });
        },
        success: async (transactionId: string, processedBy: string) => {
          return await client.userWalletTransaction.update({
            where: {
              id: transactionId,
            },
            data: {
              status: TransactionStatus.SUCCESS,
              processedAt: new Date(),
              processedBy: {
                connect: {
                  id: processedBy,
                },
              },
            },
          });
        },
      },
      order: {
        complete: async (orderId: string, processedBy: string) => {
          return await client.order.update({
            where: {
              id: orderId,
              status: {
                in: [OrderStatus.PENDING, OrderStatus.CREATED],
              },
            },
            data: {
              status: OrderStatus.COMPLETED,
              processedAt: new Date(),
              processedBy: {
                connect: {
                  id: processedBy,
                },
              },
            },
          });
        },
        cancel: async (orderId: string, processedBy: string) => {
          return await client.order.update({
            where: {
              id: orderId,
              status: {
                in: [OrderStatus.PENDING, OrderStatus.CREATED],
              },
            },
            data: {
              status: OrderStatus.CANCELLED,
              processedAt: new Date(),
              processedBy: {
                connect: {
                  id: processedBy,
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
