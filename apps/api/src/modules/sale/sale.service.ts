import { Injectable } from '@nestjs/common';
import { DiscountType, Sale } from '@pawpal/prisma';
import { Decimal } from '@pawpal/prisma/generated/client/runtime/library';
import { ProductSaleValue } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleService {
  constructor(private readonly prisma: PrismaService) {}

  async getMostDiscountedSaleByProduct(
    productId: string,
  ): Promise<ProductSaleValue | null> {
    const sales = await this.getSalesByProduct(productId);
    if (sales.length === 0) return null;

    const mostPercentDiscount = sales
      .slice()
      .sort((a, b) => Number(b.discount) - Number(a.discount))[0];

    return {
      percent: Number(mostPercentDiscount.discount),
      endAt: mostPercentDiscount.endAt.toISOString(),
      startAt: mostPercentDiscount.startAt.toISOString(),
    };
  }

  async getPackagesHasSaleByProduct(productId: string): Promise<any> {
    return await this.prisma.package.findMany({
      where: {
        product: { slug: productId },
        sale: {
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
        sale: {
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
        package: { some: { product: { slug: productId } } },
        startAt: { lte: new Date() },
        endAt: { gte: new Date() },
        isActive: true,
      },
      orderBy: {
        discount: 'desc',
      },
    });

    const hasDiscountFixed = sales.some(
      (sale) => sale.discountType === DiscountType.FIXED,
    );

    if (hasDiscountFixed) {
      const packagesHasSale = await this.getPackagesHasSaleByProduct(productId);
      const lowestPrice = packagesHasSale.reduce(
        (min, pkg) => Math.min(min, Number(pkg.price)),
        Infinity,
      );

      const parseFixedToPercent = (sale: Sale): Decimal => {
        return ((Number(sale.discount) / lowestPrice) * 100) as any as Decimal;
      };

      return sales.map((sale) => ({
        ...sale,
        discountType: DiscountType.PERCENT,
        discount:
          sale.discountType === DiscountType.PERCENT
            ? sale.discount
            : parseFixedToPercent(sale),
      }));
    }

    return sales;
  }
}
