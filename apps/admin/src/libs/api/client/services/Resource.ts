import { ResourceResponse } from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class ResourceApi {
  constructor(private readonly client: AxiosInstance) {}

  public async list(): Promise<AxiosResponse<ResourceResponse[]>> {
    return await this.client.get("/admin/resource");
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
