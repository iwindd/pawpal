import { FindProductQuery } from '@/common/pipes/FindProductPipe';
import datatableUtils from '@/utils/datatable';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  AdminProductEditResponse,
  AdminProductResponse,
  DatatableQueryDto,
  DatatableResponse,
  ProductInput,
} from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { SaleService } from '../sale/sale.service';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly saleService: SaleService,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * Get new products
   * @param limit Number of products to return
   * @returns Array of products
   */
  async getNewProducts(limit: number = 4) {
    const products = await this.productRepository.getLatest({
      take: limit,
    });

    return products.toJSON();
  }

  /**
   * Get sale products
   * @param limit Number of products to return
   * @returns Array of products
   */
  async getSaleProducts(limit: number = 4) {
    const products = await this.productRepository.getHasSale({
      take: limit,
    });

    return products.toJSON();
  }

  async getProductBySlug(slug: string) {
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
            sales: {
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
        fields: {
          orderBy: {
            order: 'asc',
          },
          select: {
            id: true,
            order: true,
            label: true,
            placeholder: true,
            metadata: true,
            type: true,
            optional: true,
          },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      MOST_SALE: await this.prisma.package.findMostSaleByProduct(slug),
    };
  }

  async getAllProducts({ take, skip, orderBy, search }: FindProductQuery) {
    // Build where clause
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Category filter will be implemented when category filtering is needed

    const total = await this.prisma.product.count({ where });
    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
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
            sales: {
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
        MOST_SALE: true,
      },
    });

    return {
      data: products.map((product) => ({
        slug: product.slug,
        name: product.name,
        sale: product.MOST_SALE,
      })),
      total,
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
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
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
        description: true,
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
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    if (!product) throw new BadRequestException('product_not_found');

    return {
      ...product,
      packages: product.packages.map((pkg) => ({
        ...pkg,
        price: Number(pkg.price),
      })),
      packageCount: product._count.packages,
      createdAt: product.createdAt.toISOString(),
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
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    if (!product) throw new BadRequestException('product_not_found');

    return {
      ...product,
      createdAt: product.createdAt.toISOString(),
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
        packages: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    return {
      data: products.map((product) => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        packageCount: product._count.packages,
        packages: product.packages.map((pkg) => ({
          ...pkg,
          price: Number(pkg.price),
        })),
      })),
      total,
    };
  }

  async create(payload: ProductInput) {
    return await this.prisma.product.create({
      data: payload,
    });
  }

  async update(id: string, payload: ProductInput) {
    return await this.prisma.product.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: string): Promise<{ success: boolean }> {
    await this.prisma.product.delete({
      where: { id },
    });

    return { success: true };
  }
}
