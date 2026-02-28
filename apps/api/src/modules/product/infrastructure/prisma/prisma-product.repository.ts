import { ProductResponseMapper } from '@/common/mappers/ProductResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Prisma } from '@/generated/prisma/client';
import { ResourceType } from '@/generated/prisma/enums';
import { SaleUtil } from '@/utils/saleUtil';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
        category: { select: { id: true, name: true, slug: true } },
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
      MOST_SALE: await this.prisma.package.findMostSaleByProduct(slug),
    };
  }

  async getAllProductDatatable(query: DatatableQuery, filterCategory?: string) {
    return this.prisma.product.getDatatable({
      query,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        createdAt: true,
        category: { select: { name: true, slug: true } },
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
        MOST_SALE: true,
      },
      searchable: {
        name: { mode: 'insensitive' },
        slug: { mode: 'insensitive' },
        description: { mode: 'insensitive' },
        category: {
          name: { mode: 'insensitive' },
          slug: { mode: 'insensitive' },
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
      },
      ...(filterCategory && { where: { category: { slug: filterCategory } } }),
    });
  }

  async getSaleProductDatatable(query: DatatableQuery) {
    const now = new Date();
    return this.prisma.product.getDatatable({
      query,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        createdAt: true,
        category: { select: { name: true, slug: true } },
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
        MOST_SALE: true,
      },
      searchable: {
        name: { mode: 'insensitive' },
        slug: { mode: 'insensitive' },
        description: { mode: 'insensitive' },
        category: {
          name: { mode: 'insensitive' },
          slug: { mode: 'insensitive' },
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
      },
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

  async updateProduct(id: string, payload: any, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        imageId: true,
        categoryId: true,
        stock: { select: { quantity: true } },
      },
    });

    if (!product) throw new BadRequestException('product_not_found');

    const {
      image_id: imageId,
      category_id: categoryId,
      isStockTracked,
      stock,
      stockNote,
      ...rest
    } = payload;

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

    const stockDiff = stock - (product.stock?.quantity || 0);

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
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
        image: image,
        category: { connect: { id: categoryId } },
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
