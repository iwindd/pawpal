import { ProductType } from "@/app/Home/types";

export const getSectionIcon = (type: ProductType) => {
  switch (type) {
    case "flashsale":
      return "🔥";
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
