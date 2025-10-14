import datatableUtils from '@/utils/datatable';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AdminProductEditResponse,
  AdminProductResponse,
  DatatableQueryDto,
  DatatableResponse,
  ProductInput,
  ProductListItem,
  ProductResponse,
  ProductSaleValue,
} from '@pawpal/shared';
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

  async getNewProducts(limit?: number): Promise<ProductListItem[]> {
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

  async getSaleProducts(limit?: number): Promise<ProductListItem[]> {
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

  async getProductBySlug(slug: string): Promise<ProductResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: {
        slug: true,
        name: true,
        description: true,
        createdAt: true,
        category: {
          select: {
            id: true,
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

    if (!product) return null;

    const sales = product.packages.flatMap((pkg) => pkg.sale);
    const mostDiscountedSale = this.getMostDiscountedSale(sales);

    return {
      slug: product.slug,
      name: product.name,
      description: product.description,
      createdAt: product.createdAt.toISOString(),
      category: product.category,
      productTags: product.productTags,
      packages: product.packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        price: Number(pkg.price),
        description: pkg.description,
        sale:
          pkg.sale.length > 0
            ? {
                percent: Number(pkg.sale[0].discount),
                endAt: pkg.sale[0].endAt.toISOString(),
                startAt: pkg.sale[0].startAt.toISOString(),
              }
            : undefined,
      })),
      sales: mostDiscountedSale,
    };
  }

  async getAllProducts(params: GetAllProductsParams): Promise<{
    products: ProductListItem[];
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

    // Category filter will be implemented when category filtering is needed

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

  async findOneForEdit(id: string): Promise<AdminProductEditResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        createdAt: true,
        category: {
          select: {
            id: true,
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
          },
        },
      },
    });

    if (!product) return null;

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      createdAt: product.createdAt.toISOString(),
      category: product.category,
      productTags: product.productTags,
      packages: product.packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        price: Number(pkg.price),
        description: pkg.description,
      })),
    };
  }

  // TODO:: Refactor types
  async findOneCombobox(id: string): Promise<AdminProductResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        name: true,
        createdAt: true,
        _count: {
          select: { packages: true },
        },
        category: {
          select: {
            id: true,
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
      },
    });

    if (!product) throw new BadRequestException('product_not_found');

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      createdAt: product.createdAt.toISOString(),
      packageCount: product._count.packages,
      category: product.category,
      productTags: product.productTags,
    };
  }

  async findOne(id: string): Promise<AdminProductEditResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        createdAt: true,
        category: {
          select: {
            id: true,
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
          },
        },
      },
    });

    if (!product) throw new BadRequestException('product_not_found');

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      createdAt: product.createdAt.toISOString(),
      category: product.category,
      productTags: product.productTags,
      packages: product.packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        price: Number(pkg.price),
        description: pkg.description,
      })),
    };
  }

  async getProducts(
    queryParams: DatatableQueryDto,
  ): Promise<DatatableResponse<AdminProductResponse>> {
    const { page, limit, sort } = queryParams;
    const skip = (page - 1) * limit;

    const search = queryParams.search;
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const total = await this.prisma.product.count({ where });
    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: datatableUtils.buildOrderBy(sort),
      select: {
        id: true,
        slug: true,
        name: true,
        createdAt: true,
        _count: {
          select: { packages: true },
        },
        category: {
          select: {
            id: true,
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
      },
    });

    return {
      data: products.map((product) => ({
        id: product.id,
        slug: product.slug,
        name: product.name,
        createdAt: product.createdAt.toISOString(),
        packageCount: product._count.packages,
        category: product.category,
        productTags: product.productTags,
      })),
      total,
    };
  }

  async create(data: ProductInput): Promise<AdminProductResponse> {
    const { packages, ...productData } = data;

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        packages: {
          create: packages,
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        createdAt: true,
        _count: {
          select: { packages: true },
        },
        category: {
          select: {
            id: true,
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
      },
    });

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      createdAt: product.createdAt.toISOString(),
      packageCount: product._count.packages,
      category: product.category,
      productTags: product.productTags,
    };
  }

  async update(id: string, data: ProductInput) {
    const { packages, ...productData } = data;

    // If packages are provided, replace all existing packages
    const updateData: any = { ...productData };

    if (packages) {
      updateData.packages = {
        deleteMany: {},
        create: packages,
      };
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        slug: true,
        name: true,
        createdAt: true,
        _count: {
          select: { packages: true },
        },
        category: {
          select: {
            id: true,
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
      },
    });

    if (!product) throw new BadRequestException('product_not_found');
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.prisma.product.delete({
      where: { id },
    });

    return { success: true };
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
