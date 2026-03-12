import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CategoryInput,
  CategoryResponse,
  CategoryUpdateInput,
  DatatableResponse,
} from '@pawpal/shared';
import { PrismaService } from '../../../prisma/prisma.service';
import { ICategoryRepository } from '../../domain/repository.port';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: DatatableQuery,
  ): Promise<DatatableResponse<CategoryResponse>> {
    return this.prisma.category.getDatatable({
      query,
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
      searchable: {
        name: { mode: 'insensitive' },
        slug: { mode: 'insensitive' },
      },
    });
  }

  async findOne(id: string): Promise<CategoryResponse> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!category) throw new BadRequestException('Category not found');
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  async create(data: CategoryInput): Promise<CategoryResponse> {
    const existing = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (existing)
      throw new BadRequestException('Category with this slug already exists');

    const category = await this.prisma.category.create({
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  async update(
    id: string,
    data: CategoryUpdateInput,
  ): Promise<CategoryResponse> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new BadRequestException('Category not found');

    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await this.prisma.category.findUnique({
        where: { slug: data.slug },
      });
      if (slugExists)
        throw new BadRequestException('Category with this slug already exists');
    }

    const category = await this.prisma.category.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new BadRequestException('Category not found');

    const productsCount = await this.prisma.product.count({
      where: {
        categories: {
          some: {
            id,
          },
        },
      },
    });
    if (productsCount > 0)
      throw new BadRequestException('Cannot delete category that has products');

    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }

  async getProductsInCategoryDatatable(id: string, query: DatatableQuery) {
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
      },
      where: {
        categories: {
          some: {
            id,
          },
        },
      },
    });
  }
}
