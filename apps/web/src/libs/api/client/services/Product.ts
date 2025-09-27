import { ProductResponse } from "@pawpal/shared";
import { AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

interface GetAllProductsParams {
  page?: number;
  limit?: number;
  filters?: {
    search?: string;
    category?: string;
  };
}

interface GetAllProductsResponse {
  products: ProductResponse[];
  total: number;
  hasMore: boolean;
}

class ProductApi {
  constructor(private readonly client: AxiosInstance) {}

  async getAllProducts(
    params: GetAllProductsParams = {}
  ): Promise<PawApiResponse<GetAllProductsResponse>> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.filters?.search)
      searchParams.append("search", params.filters.search);
    if (params.filters?.category)
      searchParams.append("category", params.filters.category);

    const response = await this.client.get(
      `/product?${searchParams.toString()}`
    );
    return { success: true, data: response.data };
  }
}

export default ProductApi;
