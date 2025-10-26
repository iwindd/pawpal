import { DiscountType, ENUM_DISCOUNT_TYPE } from "@pawpal/shared";

export interface PricingSale {
  type: DiscountType;
  value: number;
}

export const getPriceWithSale = (price: number, sale: PricingSale) => {
  if (sale.type == ENUM_DISCOUNT_TYPE.PERCENT) {
    return price - (price * sale.value) / 100;
  }
  return price - sale.value;
};

export const getDiscountValue = (price: number, sale: PricingSale) => {
  if (sale.type == ENUM_DISCOUNT_TYPE.PERCENT) {
    return (price * sale.value) / 100;
  }

  return sale.value;
};

export const getPercentDiscount = (
  discountType: DiscountType,
  discount: number,
  basePrice?: number
): number => {
  console.log("get percent discount called", discountType, discount, basePrice);
  if (discountType === ENUM_DISCOUNT_TYPE.PERCENT) {
    return discount;
  }

  return basePrice ? (discount / 100) * basePrice : 0;
};
