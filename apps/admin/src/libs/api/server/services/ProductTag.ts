import { AdminTagResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class ProductTagApi {
  constructor(private readonly client: AxiosInstance) {}

  public async findOne(id: string): Promise<PawApiResponse<AdminTagResponse>> {
    try {
      const response = await this.client.get(`/admin/tag/${id}`);

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
