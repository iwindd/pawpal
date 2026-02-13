import { AdminProductTagResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class ProductTagApi {
  constructor(private readonly client: AxiosInstance) {}

  public async findOne(
    id: string,
  ): Promise<PawApiResponse<AdminProductTagResponse>> {
    try {
      const response = await this.client.get(`/admin/product-tag/${id}`);

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

export default ProductTagApi;
