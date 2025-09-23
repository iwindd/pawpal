import { ProductResponse } from "@pawpal/shared";
import { AxiosInstance } from "axios";
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
}

export default ProductApi;
