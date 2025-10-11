import {
  CarouselInput,
  CarouselResponse,
  ResourceResponse,
} from "@pawpal/shared";
import { DataTableSortStatus } from "@pawpal/ui/core";
import { AxiosInstance, AxiosResponse } from "axios";
import { PawApiResponseDataTable } from "../../api";

class CarouselApi {
  public readonly DEFAULT_SORT: DataTableSortStatus<CarouselResponse> = {
    columnAccessor: "status",
    direction: "asc",
  };

  constructor(private readonly client: AxiosInstance) {}

  public async create(
    payload: CarouselInput
  ): Promise<AxiosResponse<ResourceResponse>> {
    return await this.client.post("/admin/carousel", payload);
  }

  public async findAll(params?: {
    sort?: DataTableSortStatus<CarouselResponse>;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PawApiResponseDataTable<CarouselResponse>> {
    return await this.client.get("/admin/carousel", {
      params: {
        sort: this.DEFAULT_SORT,
        ...(params?.sort && { sort: params.sort }),
        ...(params?.page && { page: params.page }),
        ...(params?.limit && { limit: params.limit }),
        ...(params?.search && { search: params.search }),
      },
    });
  }

  public async getPublished(params?: {
    sort?: DataTableSortStatus<CarouselResponse>;
  }): Promise<PawApiResponseDataTable<CarouselResponse>> {
    return await this.client.get("/admin/carousel/published", {
      params: {
        sort: this.DEFAULT_SORT,
        ...(params?.sort && { sort: params.sort }),
      },
    });
  }
}

export default CarouselApi;
