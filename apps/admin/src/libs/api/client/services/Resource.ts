import { DatatableResponse, ResourceResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { PawApiResponse } from "../../api";

class ResourceApi {
  constructor(private readonly client: AxiosInstance) {}

  public async list(params: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<DatatableResponse<ResourceResponse>>> {
    return await this.client.get("/admin/resource", { params });
  }

  public async findOne(
    id: string
  ): Promise<PawApiResponse<ResourceResponse | null>> {
    try {
      const response = await this.client.get(`/admin/resource/${id}`);

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

  public async upload(
    formData: FormData
  ): Promise<AxiosResponse<ResourceResponse>> {
    return await this.client.post("/admin/resource", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default ResourceApi;
