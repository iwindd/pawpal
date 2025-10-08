import { DatatableResponse, ResourceResponse } from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class ResourceApi {
  constructor(private readonly client: AxiosInstance) {}

  public async list(params: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<DatatableResponse<ResourceResponse>>> {
    return await this.client.get("/admin/resource", { params });
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
