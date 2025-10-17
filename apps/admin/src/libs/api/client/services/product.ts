import {
  AdminProductEditResponse,
  AdminProductResponse,
  DatatableResponse,
  ProductInput,
} from "@pawpal/shared";
import { DataTableSortStatus } from "@pawpal/ui/core";
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { PawApiResponse } from "../../api";

export interface AdminProductListResponse {
  products: AdminProductResponse[];
  total: number;
  hasMore: boolean;
}

export interface AdminProductInput {
  name: string;
  slug: string;
  description?: string;
  categorySlug?: string;
  productTagSlugs?: string[];
}

class ProductApi {
  constructor(private readonly client: AxiosInstance) {}

  public async list(params: {
    page?: number;
    limit?: number;
    sort?: DataTableSortStatus<AdminProductResponse>;
    search?: string;
  }): Promise<AxiosResponse<DatatableResponse<AdminProductResponse>>> {
    return await this.client.get("/admin/product", { params });
  }

  async findOne(
    id: string
  ): Promise<PawApiResponse<AdminProductResponse | null>> {
    try {
      const response = await this.client.get(`/admin/product/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  async findOneForEdit(
    id: string
  ): Promise<PawApiResponse<AdminProductEditResponse | null>> {
    try {
      const response = await this.client.get(`/admin/product/${id}/edit`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  async create(
    data: ProductInput
  ): Promise<PawApiResponse<AdminProductResponse>> {
    try {
      const response = await this.client.post("/admin/product", data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  async update(
    id: string,
    data: ProductInput
  ): Promise<PawApiResponse<AdminProductResponse>> {
    try {
      const response = await this.client.patch(`/admin/product/${id}`, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  async delete(id: string): Promise<PawApiResponse<boolean>> {
    try {
      await this.client.delete(`/admin/product/${id}`);
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }
}

export default ProductApi;
