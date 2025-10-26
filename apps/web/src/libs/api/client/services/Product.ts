import {
  DatatableInput,
  DatatableResponse,
  ProductListItem,
  ProductResponse,
} from "@pawpal/shared";
import { AxiosInstance, AxiosPromise } from "axios";

interface FindAllProductInput extends DatatableInput {
  filters?: {
    search?: string;
    category?: string;
  };
}

interface GetAllProductsResponse {
  products: ProductListItem[];
  total: number;
  hasMore: boolean;
}

class ProductApi {
  constructor(private readonly client: AxiosInstance) {}

  async getAllProducts(
    params: FindAllProductInput = {}
  ): Promise<AxiosPromise<DatatableResponse<ProductResponse>>> {
    return this.client.get("/product", { params });
  }
}

export default ProductApi;
