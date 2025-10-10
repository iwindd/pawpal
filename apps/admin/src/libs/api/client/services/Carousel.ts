import { CarouselInput, ResourceResponse } from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class CarouselApi {
  constructor(private readonly client: AxiosInstance) {}

  public async create(
    payload: CarouselInput
  ): Promise<AxiosResponse<ResourceResponse>> {
    return await this.client.post("/admin/carousel", payload);
  }
}

export default CarouselApi;
