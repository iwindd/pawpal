import { ServerApi } from "@/libs/api/server";
import { ProductResponse } from "@pawpal/shared";

export type BuilderLoader =
  | { type: "system"; name: "sale" | "new" }
  | { type: "tag"; name: string }
  | { type: "category"; name: string };

export async function loadBuilderProducts(
  API: ServerApi,
  loader: BuilderLoader,
): Promise<ProductResponse[]> {
  try {
    switch (loader.type) {
      case "system": {
        const { success, data } =
          loader.name === "sale"
            ? await API.product.getSaleProducts()
            : await API.product.getNewProducts();

        return success ? data : [];
      }
      case "tag": {
        const { success, data } = await API.product.getProductsByTag(
          loader.name,
          { limit: 12 },
        );
        return success ? data.data : [];
      }
      case "category": {
        const { success, data } = await API.product.getProductsByCategory(
          loader.name,
          { limit: 12 },
        );
        return success ? data.data : [];
      }
      default:
        return [];
    }
  } catch (error) {
    console.error("[loadBuilderProducts]", error);
    return [];
  }
}
