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

  async getLatestProducts(): Promise<ProductResponse[]> {
    const latestProducts = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        slug: true,
        name: true,
      },
    });

    return await Promise.all(
      latestProducts.map(async (product) => {
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
