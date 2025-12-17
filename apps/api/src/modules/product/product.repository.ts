import { Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { ProductCollection } from '../../common/collections/product.collection';
import { ProductEntity } from '../../common/entities/product.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  static get DEFAULT_SELECT() {
    return ProductEntity.SELECT satisfies Prisma.ProductSelect;
  }

  /**
   * Create a UserWalletTransactionEntity from a Prisma.UserWalletTransactionGetPayload
   * @param transaction Prisma.UserWalletTransactionGetPayload
   * @returns UserWalletTransactionEntity
   */
  public from(
    product: Prisma.ProductGetPayload<{
      select: typeof ProductRepository.DEFAULT_SELECT;
    }>,
  ) {
    return new ProductEntity(product, this);
  }

  /**
   * Find a transaction by id
   * @param args find first args
   * @returns UserWalletTransactionEntity
   */
  public async getLatest(
    args?: Pick<
      Prisma.ProductFindManyArgs,
      'where' | 'orderBy' | 'take' | 'skip'
    >,
  ) {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      ...args,
      select: ProductRepository.DEFAULT_SELECT,
    });

    return new ProductCollection(products.map((p) => this.from(p)));
  }

  /**
   * Find products that has sale
   * @param args find many args
   * @returns ProductCollection
   */
  public async getHasSale(
    args?: Pick<
      Prisma.ProductFindManyArgs,
      'where' | 'orderBy' | 'take' | 'skip'
    >,
  ) {
    const now = new Date();
    const products = await this.prisma.product.findMany({
      select: ProductRepository.DEFAULT_SELECT,
      orderBy: {
        createdAt: 'desc',
      },
      ...args,
      where: {
        AND: [
          args?.where ?? {},
          {
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
        ],
      },
    });

    return new ProductCollection(products.map((p) => this.from(p)));
  }
}
