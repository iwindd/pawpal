import { Injectable, BadRequestException } from '@nestjs/common';
import { CategoryResponse, CategoryInput, CategoryUpdateInput } from '@pawpal/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string): Promise<CategoryResponse[]> {
    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }));
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

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  async create(data: CategoryInput): Promise<CategoryResponse> {
    // Check if slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this slug already exists');
    }

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

  async update(id: string, data: CategoryUpdateInput): Promise<CategoryResponse> {
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new BadRequestException('Category not found');
    }

    // If slug is being updated, check if it's unique
    if (data.slug && data.slug !== existingCategory.slug) {
      const slugExists = await this.prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        throw new BadRequestException('Category with this slug already exists');
      }
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
    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new BadRequestException('Category not found');
    }

    // Check if category has products
    const productsCount = await this.prisma.product.count({
      where: { category_id: id },
    });

    if (productsCount > 0) {
      throw new BadRequestException('Cannot delete category that has products');
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { success: true };
  }
}
