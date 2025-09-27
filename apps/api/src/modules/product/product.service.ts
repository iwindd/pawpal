import { Injectable } from '@nestjs/common';
import { ProductResponse, ProductSaleValue } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { SaleService } from '../sale/sale.service';

interface GetAllProductsParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}

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

  async getAllProducts(params: GetAllProductsParams): Promise<{
    products: ProductResponse[];
    total: number;
    hasMore: boolean;
  }> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // TODO: Add category filter

    let orderBy: any = { createdAt: 'desc' };
    const total = await this.prisma.product.count({ where });
    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        slug: true,
        name: true,
        description: true,
        createdAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        productTags: {
          select: {
            slug: true,
            name: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
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
    });

    const productsWithSales = products.map((product) => {
      const sales = product.packages.flatMap((pkg) => pkg.sale);
      const mostDiscountedSale = this.getMostDiscountedSale(sales);

      return {
        slug: product.slug,
        name: product.name,
        sales: mostDiscountedSale,
      };
    });

    const hasMore = skip + limit < total;

    return {
      products: productsWithSales,
      total,
      hasMore,
    };
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
