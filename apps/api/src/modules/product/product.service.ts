import { ProductResponseMapper } from '@/common/mappers/ProductResponseMapper';
import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Prisma } from '@/generated/prisma/client';
import { ResourceType } from '@/generated/prisma/enums';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProductInput } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';
import { ResourceService } from '../resource/resource.service';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly productRepository: ProductRepository,
    private readonly resourceService: ResourceService,
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

  /**
   * Get all products with datatable
   * @param query Datatable query
   * @returns Datatable response
   */
  async getAllProductDatatable(query: DatatableQuery) {
    this.logger.debug(query);
    const filterCategory =
      query.filter || query.filter != 'all' ? null : query.filter;

    return this.prisma.product.getDatatable({
      query,
      select: {
        id: true,
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

  /**
   * Get all products with datatable
   * @param query Datatable query
   * @returns Datatable response
   */
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

  /**
   * Get a product by id
   * @param id Product id
   * @returns Product
   */
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: ProductResponseMapper.SELECT,
    });

    if (!product) throw new BadRequestException('product_not_found');

    return ProductResponseMapper.fromQuery(product);
  }

  /**
   * Get products datatable
   * @param query Datatable query
   * @returns Datatable response
   */
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

  /**
   * Create a new product
   * @param payload Product data
   * @param userId User ID
   * @returns Created product
   */
  async createProduct(payload: ProductInput, userId: string) {
    const { image_id, category_id, ...rest } = payload;

    const image = await this.resourceService.copyResourceToProduct(image_id);

    const product = await this.prisma.product.create({
      data: {
        ...rest,
        image: {
          create: {
            url: image.key,
            type: ResourceType.PRODUCT_IMAGE,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
        category: {
          connect: {
            id: category_id,
          },
        },
      },
    });

    return product;
  }

  /**
   * Update a product
   * @param id Product ID
   * @param payload Product data
   * @param userId User ID
   * @returns Updated product
   */
  async updateProduct(id: string, payload: ProductInput, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        imageId: true,
        categoryId: true,
      },
    });

    if (!product) throw new BadRequestException('product_not_found');

    const { image_id: imageId, category_id: categoryId, ...rest } = payload;

    let image: Prisma.ProductUpdateInput['image'] = {};

    if (product.imageId !== imageId) {
      image = {
        create: {
          url: (await this.resourceService.copyResourceToProduct(imageId)).key,
          type: ResourceType.PRODUCT_IMAGE,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      };
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        image: image,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
      select: ProductResponseMapper.SELECT,
    });

    return ProductResponseMapper.fromQuery(updatedProduct);
  }
}
