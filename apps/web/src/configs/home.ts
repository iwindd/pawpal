import { ServerApi } from "@/libs/api/server";
import {
  ENUM_HOME_SECTION_SYSTEM_LOADER_NAME,
  ProductResponse,
} from "@pawpal/shared";

export type BuilderLoader =
  | { type: "system"; name: ENUM_HOME_SECTION_SYSTEM_LOADER_NAME }
  | { type: "tag"; name: string }
  | { type: "category"; name: string };

export async function loadBuilderProducts(
  API: ServerApi,
  loader: BuilderLoader,
): Promise<ProductResponse[]> {
  try {
    switch (loader.type) {
      case "system": {
        let result;
        switch (loader.name) {
          case ENUM_HOME_SECTION_SYSTEM_LOADER_NAME.newest:
            result = await API.product.getNewProducts();
            break;
          case ENUM_HOME_SECTION_SYSTEM_LOADER_NAME.popular:
            result = await API.product.getSaleProducts(); // Assuming popular maps to sale for now
            break;
          default:
            // For latest, favorite, promotion - we may need to implement new API endpoints
            console.warn(
              `System loader "${loader.name}" not yet implemented, using newest as fallback`,
            );
            result = await API.product.getNewProducts();
            break;
        }
        return result.success ? result.data : [];
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
