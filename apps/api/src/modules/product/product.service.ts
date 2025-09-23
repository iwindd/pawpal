import { Injectable } from '@nestjs/common';
import { ProductResponse } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { SaleService } from '../sale/sale.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly saleService: SaleService,
  ) {}

  async getNewProducts(limit?: number): Promise<ProductResponse[]> {
    const newProducts = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        slug: true,
        name: true,
      },
      take: limit || 4,
    });

    return await Promise.all(
      newProducts.map(async (product) => {
        return {
          ...product,
          sales: await this.saleService.getMostDiscountedSaleByProduct(
            product.slug,
          ),
        };
      }),
    );
  }

  async getSaleProducts(limit?: number): Promise<ProductResponse[]> {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit || 4,
    });
    if (!currentSale) return [];

    return await Promise.all(
      currentSale.map(async (product) => {
        return {
          ...product,
          sales: await this.saleService.getMostDiscountedSaleByProduct(
            product.slug,
          ),
        };
      }),
    ).then((products) =>
      products.slice().sort((a, b) => b.sales.percent - a.sales.percent),
    );
  }
}
