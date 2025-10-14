import { ProductResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class ProductApi {
  constructor(private readonly client: AxiosInstance) {}

  async getNewProducts(): Promise<PawApiResponse<ProductResponse[]>> {
    const response = await this.client.get("/product/new");
    return { success: true, data: response.data };
  }

  async getSaleProducts(): Promise<PawApiResponse<ProductResponse[]>> {
    const response = await this.client.get("/product/sale");
    return { success: true, data: response.data };
  }

  async findOneBySlug(slug: string): Promise<PawApiResponse<ProductResponse>> {
    try {
      const response = await this.client.get(`/product/${slug}`);

      return {
        success: true,
        data: response.data as ProductResponse,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: error as AxiosError,
      };
    }
  }
}

export default ProductApi;
