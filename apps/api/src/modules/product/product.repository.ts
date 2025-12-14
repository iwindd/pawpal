import { Prisma } from '@/generated/prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { ProductCollection } from '../../common/collections/product.collection';
import { ProductEntity } from '../../common/entities/product.entity';
import { PrismaService } from '../prisma/prisma.service';

export const DEFAULT_PRODUCT_SELECT = () =>
  ({
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
  }) satisfies Prisma.ProductSelect;

@Injectable()
export class ProductRepository {
  private readonly logger = new Logger(ProductRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a UserWalletTransactionEntity from a Prisma.UserWalletTransactionGetPayload
   * @param transaction Prisma.UserWalletTransactionGetPayload
   * @returns UserWalletTransactionEntity
   */
  public from(
    product: Prisma.ProductGetPayload<{
      select: ReturnType<typeof DEFAULT_PRODUCT_SELECT>;
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
      select: DEFAULT_PRODUCT_SELECT(),
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
      select: DEFAULT_PRODUCT_SELECT(),
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
