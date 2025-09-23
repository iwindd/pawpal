import { ServerApi } from "@/libs/api/server";
import { getSectionIcon } from "@/utils/productUtils";
import { ProductResponse } from "@pawpal/shared";

export const homeProductSections = [
  {
    key: "latest",
    label: "Latest",
    icon: getSectionIcon("latest"),
    onLoad: async (API: ServerApi): Promise<ProductResponse[]> => {
      try {
        const { success, data } = await API.product.getLatestProducts();
        if (!success) return [];
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
];
