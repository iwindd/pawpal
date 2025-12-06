import { Prisma } from '@/generated/prisma/client';
import { DiscountType, ENUM_DISCOUNT_TYPE } from '@pawpal/shared';

const getPercentDiscount = (
  discountType: DiscountType,
  discount: number,
  basePrice?: number,
): number => {
  if (discountType === ENUM_DISCOUNT_TYPE.PERCENT) {
    return discount;
  }

  return basePrice ? (discount / 100) * basePrice : 0;
};

export const packageSaleExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'packageSaleExtension',
    model: {
      package: {
        findMostSaleByProduct: async (productSlugOrId: string) => {
          const packaes = await client.package.findMany({
            where: {
              product: {
                OR: [{ slug: productSlugOrId }, { id: productSlugOrId }],
              },
            },
            select: {
              price: true,
              sales: {
                where: {
                  startAt: { lte: new Date() },
                  endAt: { gte: new Date() },
                },
                select: {
                  discount: true,
                  discountType: true,
                  startAt: true,
                  endAt: true,
                },
              },
            },
          });

          const sales = packaes.flatMap((pkg) =>
            pkg.sales.map((sale) => ({
              ...sale,
              price: pkg.price,
            })),
          );
          if (sales.length === 0) return null;

          const mostDiscountedSale = sales.reduce((prev, current) => {
            const prevPercent = getPercentDiscount(
              prev.discountType,
              +prev.discount,
              +prev.price,
            );
            const currentPercent = getPercentDiscount(
              current.discountType,
              +current.discount,
              +current.price,
            );

            return currentPercent > prevPercent ? current : prev;
          }, sales[0]);

          return mostDiscountedSale;
        },
      },
    },
    result: {
      product: {
        MOST_SALE: {
          needs: {
            id: true,
          },
          compute(product: {
            id: string;
            packages: {
              price: number;
              sales: {
                discount: number;
                discountType: DiscountType;
                startAt: Date;
                endAt: Date;
              }[];
            }[];
          }) {
            if (!product.packages) return null;
            if (product.packages.length === 0) return null;
            if (!product.packages[0].sales) return null;

            const sales = product.packages.flatMap((pkg) =>
              pkg.sales.map((sale) => ({
                ...sale,
                price: pkg.price,
              })),
            );
            if (sales.length === 0) return null;

            const mostDiscountedSale = sales.reduce((prev, current) => {
              const prevPercent = getPercentDiscount(
                prev.discountType,
                prev.discount,
                prev.price,
              );
              const currentPercent = getPercentDiscount(
                current.discountType,
                current.discount,
                current.price,
              );

              return currentPercent > prevPercent ? current : prev;
            }, sales[0]);

            return {
              ...mostDiscountedSale,
              discount: +mostDiscountedSale.discount,
            };
          },
        },
      },
    },
  });
});
