import { OrderStatus, Prisma } from '@/generated/prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger(`OrderExtension`);

export const OrderExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'OrderExtension',
    model: {
      order: {
        setStatus: async (id: string, status: OrderStatus) => {
          logger.log(`Setting order ${id} status to ${status}`);
          return client.order.update({
            where: {
              id,
            },
            data: {
              status,
            },
          });
        },
      },
    },
  });
});
