import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductTagType } from '@pawpal/prisma';
import dayjs from 'dayjs';
import { PrismaService } from '../prisma/prisma.service';
import { ProductTagService } from './product-tag.service';

enum AUTO_UPDATE_TAG {
  LATEST = 'latest',
}

@Injectable()
export class ProductTagUpdaterService {
  private readonly logger = new Logger(ProductTagUpdaterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly productTagService: ProductTagService,
  ) {}

  @Cron(CronExpression.EVERY_10_HOURS)
  async updateSystemTags() {
    const sevenDaysAgo = dayjs().subtract(7, 'day').toDate();
    await this.updateLatestTag(sevenDaysAgo);
  }

  private async updateLatestTag(date: Date) {
    const removedProducts = await this.removeLatestTag(date);
    const addedProducts = await this.addLatestTag(date);
    this.logger.log(
      `[Latest] Removed ${removedProducts.length} products. Added ${addedProducts.length} products.`,
    );
  }

  private async removeLatestTag(date: Date) {
    const productsToRemove = await this.prisma.product.findMany({
      where: {
        productTags: { some: { slug: AUTO_UPDATE_TAG.LATEST } },
        createdAt: { lt: date },
      },
      select: { slug: true },
    });

    if (productsToRemove.length === 0) return [];

    const updatePromises = productsToRemove.map((product) =>
      this.prisma.product.update({
        where: { slug: product.slug },
        data: {
          productTags: { disconnect: { slug: AUTO_UPDATE_TAG.LATEST } },
        },
      }),
    );

    try {
      await this.prisma.$transaction(updatePromises);
      return productsToRemove;
    } catch (error) {
      this.logger.error('Error removing products from latest tag:', error);
    }
  }

  private async addLatestTag(date: Date) {
    const productsToAdd = await this.prisma.product.findMany({
      where: {
        createdAt: { gte: date },
        productTags: { none: { slug: AUTO_UPDATE_TAG.LATEST } },
      },
      select: { slug: true },
    });

    if (productsToAdd.length === 0) return [];

    await this.getOrCreateTag(AUTO_UPDATE_TAG.LATEST);

    const updatePromises = productsToAdd.map((product) =>
      this.prisma.product.update({
        where: { slug: product.slug },
        data: {
          productTags: { connect: { slug: AUTO_UPDATE_TAG.LATEST } },
        },
      }),
    );

    try {
      await this.prisma.$transaction(updatePromises);
      return productsToAdd;
    } catch (error) {
      this.logger.error('Error adding products to latest tag:', error);
    }
  }

  private async getOrCreateTag(slug: string) {
    let tag = await this.prisma.productTags.findUnique({ where: { slug } });
    if (!tag) {
      tag = await this.prisma.productTags.create({
        data: { slug, name: slug, type: ProductTagType.SYSTEM },
      });
    }
    return tag;
  }
}
