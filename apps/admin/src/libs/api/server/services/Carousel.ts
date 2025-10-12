import { CarouselResponse } from "@pawpal/shared";
import { DataTableSortStatus } from "@pawpal/ui/core";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../api";

class CarouselApi {
  public readonly DEFAULT_SORT: DataTableSortStatus<CarouselResponse> = {
    columnAccessor: "status",
    direction: "asc",
  };

  constructor(private readonly client: AxiosInstance) {}

  public async findOne(id: string): Promise<PawApiResponse<CarouselResponse>> {
    try {
      const response = await this.client.get(`/admin/carousel/${id}`);

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
}

export default CarouselApi;
