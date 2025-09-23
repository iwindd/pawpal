import { ProductResponse } from "@pawpal/shared";
import { AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class ProductApi {
  constructor(private readonly client: AxiosInstance) {}

  async getLatestProducts(): Promise<PawApiResponse<ProductResponse[]>> {
    const response = await this.client.get("/product/latest");
    return { success: true, data: response.data };
  }
}

export default ProductApi;
