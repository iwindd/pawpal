import { Prisma } from '@/generated/prisma/client';
import { Logger } from '@nestjs/common';

const logger = new Logger(`ProductExtension`);

export const ProductExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'productExtension',
    model: {
      product: {
        async findManyLatest<T>(this: T, args: Prisma.Args<T, 'findMany'>) {
          return await client.product.findMany({
            ...args,
            orderBy: {
              createdAt: 'desc',
              ...args.orderBy,
            },
          });
        },
        async findManyHasSale<T>(this: T, args: Prisma.Args<T, 'findMany'>) {
          return await client.product.findMany({
            ...args,
            where: {
              AND: [
                {
                  packages: {
                    some: {
                      sales: {
                        some: {
                          startAt: {
                            lte: new Date(),
                          },
                          endAt: {
                            gte: new Date(),
                          },
                        },
                      },
                    },
                  },
                },
                args.where,
              ],
            },
          });
        },
      },
    },
  });
});
