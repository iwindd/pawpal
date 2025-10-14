import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { PawApiResponse } from "../../api";

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

class CategoryApi {
  constructor(private readonly client: AxiosInstance) {}

  public async list(params?: {
    search?: string;
  }): Promise<AxiosResponse<CategoryResponse[]>> {
    return await this.client.get("/admin/category", { params });
  }

  async findOne(id: string): Promise<PawApiResponse<CategoryResponse | null>> {
    try {
      const response = await this.client.get(`/admin/category/${id}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }

  async create(data: {
    name: string;
    slug: string;
  }): Promise<PawApiResponse<CategoryResponse>> {
    try {
      const response = await this.client.post("/admin/category", data);
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
    data: {
      name?: string;
      slug?: string;
    }
  ): Promise<PawApiResponse<CategoryResponse>> {
    try {
      const response = await this.client.put(`/admin/category/${id}`, data);
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
      await this.client.delete(`/admin/category/${id}`);
      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }
}

export default CategoryApi;
