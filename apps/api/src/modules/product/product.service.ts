import { Injectable } from '@nestjs/common';
import { ProductResponse, ProductSaleValue } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { SaleService } from '../sale/sale.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly saleService: SaleService,
  ) {}

  async getNewProducts(limit?: number): Promise<ProductResponse[]> {
    const DEFAULT_LIMIT = 4;
    const productLimit = limit || DEFAULT_LIMIT;

    const newProducts = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        slug: true,
        name: true,
        packages: {
          select: {
            sale: {
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
        },
      },
      take: productLimit,
    });

    return newProducts.map((product) => {
      const sales = product.packages.flatMap((pkg) => pkg.sale);
      const mostDiscountedSale = this.getMostDiscountedSale(sales);

      return {
        slug: product.slug,
        name: product.name,
        sales: mostDiscountedSale,
      };
    });
  }

  async getSaleProducts(limit?: number): Promise<ProductResponse[]> {
    const DEFAULT_LIMIT = 4;
    const productLimit = limit || DEFAULT_LIMIT;

    const currentSale = await this.prisma.product.findMany({
      where: {
        packages: {
          some: {
            sale: {
              some: {
                startAt: { lte: new Date() },
                endAt: { gte: new Date() },
              },
            },
          },
        },
      },
      select: {
        slug: true,
        name: true,
        packages: {
          select: {
            sale: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: productLimit,
    });

    if (!currentSale.length) return [];

    const productsWithSales = currentSale.map((product) => {
      const sales = product.packages.flatMap((pkg) => pkg.sale);
      const mostDiscountedSale = this.getMostDiscountedSale(sales);

      return {
        slug: product.slug,
        name: product.name,
        sales: mostDiscountedSale,
      };
    });

    return productsWithSales
      .filter((product) => product.sales !== null)
      .sort((a, b) => (b.sales?.percent || 0) - (a.sales?.percent || 0));
  }

  private getMostDiscountedSale(sales: any[]): ProductSaleValue | null {
    if (sales.length === 0) return null;

    const mostDiscountedSale = sales.reduce((max, sale) => {
      const currentDiscount = Number(sale.discount);
      const maxDiscount = Number(max.discount);
      return currentDiscount > maxDiscount ? sale : max;
    }, sales[0]);

    return {
      percent: Number(mostDiscountedSale.discount),
      endAt: mostDiscountedSale.endAt.toISOString(),
      startAt: mostDiscountedSale.startAt.toISOString(),
    };
  }
}
