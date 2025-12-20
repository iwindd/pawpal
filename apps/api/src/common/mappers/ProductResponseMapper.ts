import { Prisma } from '@/generated/prisma/client';
import { AdminProductResponse } from '@pawpal/shared';

export class ProductResponseMapper {
  static get SELECT() {
    return {
      id: true,
      slug: true,
      name: true,
      description: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      productTags: {
        select: {
          id: true,
          name: true,
        },
      },
      image: {
        select: {
          id: true,
          url: true,
        },
      },
      _count: {
        select: {
          packages: true,
        },
      },
    } satisfies Prisma.ProductSelect;
  }

  static fromQuery(
    resource: Prisma.ProductGetPayload<{
      select: typeof ProductResponseMapper.SELECT;
    }>,
  ): AdminProductResponse {
    return {
      id: resource.id,
      slug: resource.slug,
      name: resource.name,
      description: resource.description,
      createdAt: resource.createdAt.toISOString(),
      categories: [resource.category],
      tags: resource.productTags,
      image: resource.image,
      packageCount: resource._count.packages,
    };
  }
}
