import { DiscountType } from '@/generated/prisma/client';
import { Decimal } from '@prisma/client/runtime/client';

export class SaleUtil {
  static getPercentDiscount(
    discountType: DiscountType,
    discount: Decimal,
    basePrice?: Decimal,
  ): Decimal {
    if (discountType === DiscountType.PERCENT) {
      return discount;
    }

    if (!basePrice) return new Decimal(0);

    return discount.div(100).mul(basePrice);
  }
}
