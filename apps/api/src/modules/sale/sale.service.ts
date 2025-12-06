import { Sale } from '@/generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { ENUM_DISCOUNT_TYPE } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async getPackagesHasSaleByProduct(productId: string): Promise<any> {
    return await this.prisma.package.findMany({
      where: {
        product: { slug: productId },
        sales: {
          some: {
            startAt: { lte: new Date() },
            endAt: { gte: new Date() },
          },
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        sales: {
          where: {
            startAt: { lte: new Date() },
            endAt: { gte: new Date() },
          },
          select: {
            discount: true,
            discountType: true,
          },
        },
      },
    });
  }

  async getSalesByProduct(productId: string): Promise<Sale[]> {
    const sales = await this.prisma.sale.findMany({
      where: {
        packages: { some: { product: { slug: productId } } },
        startAt: { lte: new Date() },
        endAt: { gte: new Date() },
        isActive: true,
      },
      orderBy: {
        discount: 'desc',
      },
    });

    const hasDiscountFixed = sales.some(
      (sale) => sale.discountType === ENUM_DISCOUNT_TYPE.FIXED,
    );

    if (hasDiscountFixed) {
      const packagesHasSale = await this.getPackagesHasSaleByProduct(productId);
      const lowestPrice = packagesHasSale.reduce(
        (min, pkg) => Math.min(min, Number(pkg.price)),
        Infinity,
      );

      const parseFixedToPercent = (sale: Sale) => {
        return ((Number(sale.discount) / lowestPrice) * 100) as any;
      };

      return sales.map((sale) => ({
        ...sale,
        discountType: ENUM_DISCOUNT_TYPE.PERCENT,
        discount:
          sale.discountType === ENUM_DISCOUNT_TYPE.PERCENT
            ? sale.discount
            : parseFixedToPercent(sale),
      }));
    }

    return sales;
  }
}
