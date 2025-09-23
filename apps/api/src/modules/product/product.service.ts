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
}
