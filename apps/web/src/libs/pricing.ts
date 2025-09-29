import { DiscountType } from "@pawpal/prisma";

export interface PricingSale {
  type: DiscountType;
  value: number;
}

export const getPriceWithSale = (price: number, sale: PricingSale) => {
  if (sale.type == DiscountType.PERCENT) {
    return price - (price * sale.value) / 100;
  }
  return price - sale.value;
};

export const getDiscountValue = (price: number, sale: PricingSale) => {
  if (sale.type == DiscountType.PERCENT) {
    return (price * sale.value) / 100;
  }

  return sale.value;
};
