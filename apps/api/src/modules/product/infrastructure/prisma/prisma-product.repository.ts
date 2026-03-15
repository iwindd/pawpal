import { ProductResponseMapper } from '@/common/mappers/ProductResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { FindProductFiltersQuery } from '@/common/pipes/FindProductFiltersPipe';
import { Prisma } from '@/generated/prisma/client';
import {
  ProductType as PrismaProductType,
  ResourceType,
} from '@/generated/prisma/enums';
import { SaleUtil } from '@/utils/saleUtil';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  ProductFiltersResponse,
  ProductInput,
  ProductType,
} from '@pawpal/shared';
import { PrismaService } from '../../../prisma/prisma.service';
import { CopyResourceToProductUseCase } from '../../../resource/application/usecases/copy-resource-to-product.usecase';
import { IProductRepository } from '../../domain/repository.port';

// Inlined from the old ProductEntity.SELECT
const PRODUCT_LIST_SELECT = {
  id: true,
  slug: true,
  name: true,
  packages: {
    select: {
      price: true,
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
} satisfies Prisma.ProductSelect;

function mapProductToJSON(
  product: Prisma.ProductGetPayload<{ select: typeof PRODUCT_LIST_SELECT }>,
) {
  const sale = (() => {
    if (!product.packages || product.packages.length === 0) return null;
    if (!product.packages[0].sales) return null;

    const sales = product.packages.flatMap((pkg) =>
      pkg.sales.map((s) => ({ ...s, price: pkg.price })),
    );
    if (sales.length === 0) return null;

    return sales.reduce((prev, current) => {
      const prevPercent = SaleUtil.getPercentDiscount(
        prev.discountType,
        prev.discount,
        prev.price,
      );
      const currentPercent = SaleUtil.getPercentDiscount(
        current.discountType,
        current.discount,
        current.price,
      );
      return currentPercent.greaterThan(prevPercent) ? current : prev;
    }, sales[0]);
  })();

  return { id: product.id, slug: product.slug, name: product.name, sale };
}

const PRODUCT_DATATABLE_SELECT = {
  id: true,
  slug: true,
  name: true,
  description: true,
  type: true,
  createdAt: true,
  categories: { select: { id: true, name: true, slug: true } },
  productTags: { select: { slug: true, name: true } },
  platforms: { select: { id: true, name: true, slug: true } },
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
} satisfies Prisma.ProductSelect;

const PRODUCT_DATATABLE_SEARCHABLE = {
  name: { mode: 'insensitive' },
  slug: { mode: 'insensitive' },
  description: { mode: 'insensitive' },
  categories: {
    some: {
      name: { mode: 'insensitive' },
      slug: { mode: 'insensitive' },
    },
  },
  productTags: {
    some: {
      name: { mode: 'insensitive' },
      slug: { mode: 'insensitive' },
    },
  },
  packages: {
    some: {
      name: { mode: 'insensitive' },
      description: { mode: 'insensitive' },
    },
  },
} satisfies Prisma.ProductWhereInput;

function mapProductDatatableItem(
  product: Prisma.ProductGetPayload<{
    select: typeof PRODUCT_DATATABLE_SELECT;
  }>,
) {
  return {
    ...product,
    category: product.categories[0] ?? null,
  };
}

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  private readonly logger = new Logger(PrismaProductRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly copyResourceToProduct: CopyResourceToProductUseCase,
  ) {}

  async getLatest(take = 4) {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      select: PRODUCT_LIST_SELECT,
    });
    return products.map(mapProductToJSON);
  }

  async getHasSale(take = 4) {
    const now = new Date();
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      select: PRODUCT_LIST_SELECT,
      where: {
        packages: {
          some: {
            sales: {
              some: {
                startAt: { lte: now },
                endAt: { gte: now },
              },
            },
          },
        },
      },
    });
    return products.map(mapProductToJSON);
  }

  async getByTagSlug(slug: string, query: DatatableQuery) {
    const result = await this.prisma.product.getDatatable({
      query,
      select: PRODUCT_DATATABLE_SELECT,
      searchable: PRODUCT_DATATABLE_SEARCHABLE,
      where: {
        productTags: {
          some: { slug },
        },
      },
    });

    return {
      ...result,
      data: result.data.map(mapProductDatatableItem),
    };
  }

  async getByCategorySlug(slug: string, query: DatatableQuery) {
    const result = await this.prisma.product.getDatatable({
      query,
      select: PRODUCT_DATATABLE_SELECT,
      searchable: PRODUCT_DATATABLE_SEARCHABLE,
      where: {
        categories: {
          some: {
            slug,
          },
        },
      },
    });
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        isStockTracked: true,
        stock: { select: { quantity: true } },
        createdAt: true,
        categories: { select: { id: true, name: true, slug: true } },
        productTags: { select: { slug: true, name: true } },
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
          orderBy: { order: 'asc' },
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
      category: product.categories[0] ?? null,
      MOST_SALE: await this.prisma.package.findMostSaleByProduct(slug),
    };
  }

  async getProductFilters(): Promise<ProductFiltersResponse> {
    const [categories, tags, platforms] = await Promise.all([
      this.prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { name: true, slug: true, type: true },
      }),
      this.prisma.productTag.findMany({
        orderBy: { name: 'asc' },
        select: { name: true, slug: true },
      }),
      this.prisma.platform.findMany({
        orderBy: { name: 'asc' },
        select: { name: true, slug: true },
      }),
    ]);

    return {
      types: Object.values(PrismaProductType).map((type) => ({
        value: type,
        label: type,
      })),
      platforms: platforms.map((platform) => ({
        value: platform.slug,
        label: platform.name,
      })),
      categories: categories.map((category) => ({
        value: category.slug,
        label: category.name,
        type: category.type as ProductType,
      })),
      tags: tags.map((tag) => ({
        value: tag.slug,
        label: tag.name,
      })),
    };
  }

  async getAllProductDatatable(query: FindProductFiltersQuery) {
    const where: Prisma.ProductWhereInput = {
      ...(query.filter && query.filter !== 'all' && !query.categories?.length
        ? {
            categories: {
              some: {
                slug: query.filter,
              },
            },
          }
        : {}),
      ...(query.types?.length
        ? {
            type: {
              in: query.types as PrismaProductType[],
            },
          }
        : {}),
      ...(query.platforms?.length
        ? {
            platforms: {
              some: {
                slug: {
                  in: query.platforms,
                },
              },
            },
          }
        : {}),
      ...(query.categories?.length
        ? {
            categories: {
              some: {
                slug: {
                  in: query.categories,
                },
              },
            },
          }
        : {}),
      ...(query.tags?.length
        ? {
            productTags: {
              some: {
                slug: {
                  in: query.tags,
                },
              },
            },
          }
        : {}),
    };

    const result = await this.prisma.product.getDatatable({
      query,
      select: PRODUCT_DATATABLE_SELECT,
      searchable: PRODUCT_DATATABLE_SEARCHABLE,
      where,
    });

    return {
      ...result,
      data: result.data.map(mapProductDatatableItem),
    };
  }

  async getSaleProductDatatable(query: DatatableQuery) {
    const now = new Date();
    const result = await this.prisma.product.getDatatable({
      query,
      select: PRODUCT_DATATABLE_SELECT,
      searchable: PRODUCT_DATATABLE_SEARCHABLE,
      where: {
        packages: {
          some: {
            sales: {
              some: {
                startAt: { lte: now },
                endAt: { gte: now },
              },
            },
          },
        },
      },
    });
  }

  async getProductDatatable(query: DatatableQuery) {
    return this.prisma.product.getDatatable({
      query,
      select: ProductResponseMapper.SELECT,
      searchable: {
        name: { mode: 'insensitive' },
        slug: { mode: 'insensitive' },
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: ProductResponseMapper.SELECT,
    });

    if (!product) throw new BadRequestException('product_not_found');

    return ProductResponseMapper.fromQuery(product);
  }

  async createProduct(payload: any, userId: string) {
    const { image_id, category_id, isStockTracked, stock, stockNote, ...rest } =
      payload;
    const image = await this.copyResourceToProduct.execute(image_id);

    return this.prisma.product.create({
      data: {
        ...rest,
        isStockTracked,
        stock: {
          create: {
            quantity: stock,
            movements: {
              create: {
                type: 'ADJUST',
                quantity: stock,
                note: stockNote || 'Initial stock',
                user: { connect: { id: userId } },
              },
            },
          },
        },
        image: {
          create: {
            url: image.key,
            type: ResourceType.PRODUCT_IMAGE,
            user: { connect: { id: userId } },
          },
        },
        category: { connect: { id: category_id } },
      },
    });
  }

  async updateProduct(id: string, payload: ProductInput, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        imageId: true,
        categories: true,
        stock: { select: { quantity: true } },
      },
    });

    if (!product) throw new BadRequestException('product_not_found');

    const { image_id: imageId, category_id: categoryId, ...rest } = payload;

    let image: Prisma.ProductUpdateInput['image'] = {};

    if (product.imageId !== imageId) {
      image = {
        create: {
          url: (await this.copyResourceToProduct.execute(imageId)).key,
          type: ResourceType.PRODUCT_IMAGE,
          user: { connect: { id: userId } },
        },
      };
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        image: image,
        categories: {
          connect: [{ id: categoryId }],
        },
      },
      select: ProductResponseMapper.SELECT,
    });

    return ProductResponseMapper.fromQuery(updatedProduct);
  }

  async updateProductStock(id: string, payload: any, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        stock: { select: { quantity: true } },
      },
    });

    if (!product) throw new BadRequestException('product_not_found');

    const { isStockTracked, stock, stockNote } = payload;
    const stockDiff = stock - (product.stock?.quantity || 0);

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        isStockTracked,
        stock: {
          upsert: {
            create: {
              quantity: stock,
              movements: {
                create: {
                  type: 'ADJUST',
                  quantity: stock,
                  note: stockNote,
                  user: { connect: { id: userId } },
                },
              },
            },
            update: {
              quantity: stock,
              ...(stockDiff !== 0 && {
                movements: {
                  create: {
                    type: 'ADJUST',
                    quantity: stockDiff,
                    note: stockNote,
                    user: { connect: { id: userId } },
                  },
                },
              }),
            },
          },
        },
      },
      select: {
        isStockTracked: true,
        stock: {
          select: {
            quantity: true,
          },
        },
      },
    });

    return {
      isStockTracked: updatedProduct.isStockTracked,
      stock: updatedProduct.stock?.quantity || 0,
    };
  }

  async getProductStock(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        isStockTracked: true,
        stock: { select: { quantity: true } },
      },
    });

    if (!product) throw new BadRequestException('product_not_found');

    return {
      isStockTracked: product.isStockTracked,
      stock: product.stock?.quantity || 0,
    };
  }

  async getProductStockMovementsDatatable(id: string, query: DatatableQuery) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { stock: { select: { id: true } } },
    });

    if (!product?.stock) {
      return {
        data: [],
        total: 0,
      };
    }

    return this.prisma.stockMovement.getDatatable({
      query,
      where: { stockId: product.stock.id },
      select: {
        id: true,
        type: true,
        quantity: true,
        note: true,
        createdAt: true,
        user: { select: { id: true, displayName: true } },
        order: { select: { id: true } },
      },
      searchable: {
        note: { mode: 'insensitive' },
        user: { displayName: { mode: 'insensitive' } },
        order: { id: { mode: 'insensitive' } },
      },
    });
  }
}
