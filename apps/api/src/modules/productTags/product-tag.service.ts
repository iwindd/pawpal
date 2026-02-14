import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateProductTagInput,
  slugify,
  UpdateProductTagInput,
} from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductTagService {
  constructor(private readonly prisma: PrismaService) {}

  async createProductTag(payload: CreateProductTagInput) {
    const slug = payload.slug || slugify(payload.name);

    return this.prisma.productTag.create({
      data: {
        ...payload,
        slug,
      },
    });
  }

  async getProductTagDatatable(query: DatatableQuery) {
    return this.prisma.productTag.getDatatable({
      query,
      select: {
        id: true,
        slug: true,
        name: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
      searchable: {
        name: { mode: 'insensitive' },
        slug: { mode: 'insensitive' },
      },
    });
  }

  async getProductsInTagDatatable(id: string, query: DatatableQuery) {
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
        packages: {
          some: {
            name: { mode: 'insensitive' },
            description: { mode: 'insensitive' },
          },
        },
      },
      where: {
        productTags: {
          some: {
            id,
          },
        },
      },
    });
  }

  async findOneById(id: string) {
    const productTag = await this.prisma.productTag.findFirst({
      where: { id },
    });

    if (!productTag) throw new BadRequestException('product_not_found');

    return productTag;
  }

  async update(id: string, payload: UpdateProductTagInput) {
    return this.prisma.productTag.update({
      where: { id },
      data: payload,
    });
  }
}
