import {
  CarouselInput,
  CarouselResponse,
  ResourceResponse,
} from "@pawpal/shared";
import { DataTableSortStatus } from "@pawpal/ui/core";
import { AxiosInstance, AxiosResponse } from "axios";
import { PawApiResponseDataTable } from "../../api";

class CarouselApi {
  constructor(private readonly client: AxiosInstance) {}

  public async create(
    payload: CarouselInput
  ): Promise<AxiosResponse<ResourceResponse>> {
    return await this.client.post("/admin/carousel", payload);
  }

  public async getPublished(params?: {
    sort?: DataTableSortStatus<any>;
  }): Promise<PawApiResponseDataTable<CarouselResponse>> {
    return await this.client.get("/admin/carousel/published", { params });
  }
}

export default CarouselApi;
