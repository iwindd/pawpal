import { DatatableQuery } from '@/common/pipes/DatatablePipe';
import { Injectable } from '@nestjs/common';
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

  async update(id: string, payload: UpdateProductTagInput) {
    return this.prisma.productTag.update({
      where: { id },
      data: payload,
    });
  }
}
