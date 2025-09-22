import { Prisma } from "@pawpal/prisma";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

type ProductTagWithProducts = Prisma.ProductTagsGetPayload<{
  include: { products: true };
}>;

class ProductTagApi {
  constructor(private readonly client: AxiosInstance) {}

  async getProductByTags(
    tags: string[]
  ): Promise<PawApiResponse<ProductTagWithProducts[]>> {
    try {
      const tagString = tags.join(",");
      const response = await this.client.get("/product-tag", {
        params: { tags: tagString },
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }
}

export default ProductTagApi;
