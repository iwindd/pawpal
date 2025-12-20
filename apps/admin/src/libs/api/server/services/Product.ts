import { AdminProductResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class ProductApi {
  constructor(private readonly client: AxiosInstance) {}

  public async findOne(
    id: string
  ): Promise<PawApiResponse<AdminProductResponse>> {
    try {
      const response = await this.client.get(`/admin/product/${id}`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        data: error as AxiosError,
      };
    }
  }
}

export default ProductApi;
