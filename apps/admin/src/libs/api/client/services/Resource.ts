import { ResourceResponse } from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class ResourceApi {
  constructor(private readonly client: AxiosInstance) {}

  public async list(): Promise<AxiosResponse<ResourceResponse[]>> {
    return await this.client.get("/admin/resource");
  }
}

export default ResourceApi;
