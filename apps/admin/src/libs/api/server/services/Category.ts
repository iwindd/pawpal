import { AdminCategoryResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class CategoryApi {
  constructor(private readonly client: AxiosInstance) {}

  public async findOne(
    id: string,
  ): Promise<PawApiResponse<AdminCategoryResponse>> {
    try {
      const response = await this.client.get(`/admin/category/${id}`);

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

export default CategoryApi;
