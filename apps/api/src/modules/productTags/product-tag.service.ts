import utils from '@/utils/utils';
import { Injectable } from '@nestjs/common';
import { ProductTags } from '@pawpal/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductTagService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductByTag(tag: string): Promise<ProductTags> {
    return await this.prisma.productTags.findUnique({
      where: { slug: tag },
      include: {
        products: true,
      },
    });
  }

  async getProductByTags(tags: string | string[]): Promise<ProductTags[]> {
    const tagsArray = utils.splitTags(tags);

    if (tagsArray.length === 0) {
      return [];
    }

    return await this.prisma.productTags.findMany({
      where: { slug: { in: tagsArray } },
      include: {
        products: true,
      },
    });
  }
}
