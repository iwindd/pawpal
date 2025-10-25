import { IconFlashsale } from "@pawpal/icons";
import { ProductSaleValue } from "@pawpal/shared";
import dayjs from "dayjs";

export const getSectionIcon = (slug: string) => {
  switch (slug) {
    case "flashsale":
      return <IconFlashsale size={15} />;
    case "popular":
      return "⭐";
    case "new":
      return "✨";
    case "latest":
      return "🆕";
    default:
      return "📦";
  }
};

export const isFlashsale = (sales: ProductSaleValue | null): boolean => {
  if (!sales) return false;
  const startAt = dayjs(sales.startAt);
  const endAt = dayjs(sales.endAt);
  return endAt.diff(startAt, "hour") < 24;
};

export const getDiscountedPrice = (
  price: number,
  sale?: ProductSaleValue
): number => {
  if (!sale) return price;
  return price - price * (sale.percent / 100);
};
