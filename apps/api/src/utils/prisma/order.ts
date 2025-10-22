import { Prisma } from '@pawpal/prisma';

export const OrderExtension = {
  withUserAndPackages(): Prisma.OrderInclude {
    return {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
        },
      },
      orderPackages: {
        include: {
          package: {
            include: {
              product: {
                include: {
                  category: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
  },
};
