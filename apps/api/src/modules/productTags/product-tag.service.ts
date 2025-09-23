import utils from '@/utils/utils';
import { Injectable } from '@nestjs/common';
import { ProductTags } from '@pawpal/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { SaleService } from '../sale/sale.service';

@Injectable()
export class ProductTagService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly saleService: SaleService,
  ) {}

  async getProductByTag(tag: string): Promise<ProductTags> {
    return await this.prisma.productTags.findUnique({
      where: { slug: tag },
      include: {
        products: true,
      },
    });
  }

  async getProductByTags(tags: string | string[]): Promise<any> {
    const tagsArray = utils.splitTags(tags);

    if (tagsArray.length === 0) {
      return [];
    }

    const productTags = await this.prisma.productTags.findMany({
      where: { slug: { in: tagsArray } },
      select: {
        slug: true,
        name: true,
        products: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    });

    return await Promise.all(
      productTags.map(async (productTag) => {
        return {
          ...productTag,
          products: await Promise.all(
            productTag.products.map(async (product) => {
              const mostDiscountedSale =
                await this.saleService.getMostDiscountedSaleByProduct(
                  product.slug,
                );
              return {
                ...product,
                sales: mostDiscountedSale
                  ? {
                      ...mostDiscountedSale,
                      percent: Number(mostDiscountedSale?.percent),
                    }
                  : null,
              };
            }),
          ),
        };
      }),
    );
  }
}
