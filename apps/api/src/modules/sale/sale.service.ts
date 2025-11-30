import { Injectable } from '@nestjs/common';
import { DiscountType, Sale } from '@pawpal/prisma';
import { DecimalJsLike } from '@pawpal/prisma/generated/client/runtime/client';
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
      (sale) => sale.discountType === DiscountType.FIXED,
    );

    if (hasDiscountFixed) {
      const packagesHasSale = await this.getPackagesHasSaleByProduct(productId);
      const lowestPrice = packagesHasSale.reduce(
        (min, pkg) => Math.min(min, Number(pkg.price)),
        Infinity,
      );

      const parseFixedToPercent = (sale: Sale): DecimalJsLike => {
        return ((Number(sale.discount) / lowestPrice) *
          100) as any as DecimalJsLike;
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
