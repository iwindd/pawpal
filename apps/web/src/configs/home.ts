import { ServerApi } from "@/libs/api/server";
import { getSectionIcon } from "@/utils/productUtils";
import { ProductResponse } from "@pawpal/shared";

export const homeProductSections = [
  {
    key: "new",
    label: "New",
    icon: getSectionIcon("new"),
    onLoad: async (API: ServerApi): Promise<ProductResponse[]> => {
      try {
        const { success, data } = await API.product.getNewProducts();
        if (!success) return [];
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
];
