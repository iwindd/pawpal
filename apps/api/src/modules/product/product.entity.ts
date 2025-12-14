import { Prisma } from '@/generated/prisma/client';
import { SaleUtil } from '@/utils/saleUtil';
import {
  DEFAULT_PRODUCT_SELECT,
  ProductRepository,
} from './product.repository';

export type ProductEntityProps = Prisma.ProductGetPayload<{
  select: ReturnType<typeof DEFAULT_PRODUCT_SELECT>;
}>;

export class ProductEntity {
  constructor(
    private readonly product: ProductEntityProps,
    private readonly repo: ProductRepository,
  ) {}

  public get id() {
    return this.product.id;
  }

  public get slug() {
    return this.product.slug;
  }

  public get name() {
    return this.product.name;
  }

  public get sale() {
    if (!this.product.packages) return null;
    if (this.product.packages.length === 0) return null;
    if (!this.product.packages[0].sales) return null;

    const sales = this.product.packages.flatMap((pkg) =>
      pkg.sales.map((sale) => ({
        ...sale,
        price: pkg.price,
      })),
    );

    if (sales.length === 0) return null;

    const mostDiscountedSale = sales.reduce((prev, current) => {
      const prevPercent = SaleUtil.getPercentDiscount(
        prev.discountType,
        prev.discount,
        prev.price,
      );
      const currentPercent = SaleUtil.getPercentDiscount(
        current.discountType,
        current.discount,
        current.price,
      );

      return currentPercent.greaterThan(prevPercent) ? current : prev;
    }, sales[0]);

    return {
      ...mostDiscountedSale,
      discount: mostDiscountedSale.discount,
    };
  }

  public toJSON() {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      sale: this.sale,
    };
  }
}
