import { AdminOrderResponse, DatatableResponse } from "@pawpal/shared";
import { DataTableSortStatus } from "@pawpal/ui/core";
import { AxiosInstance, AxiosResponse } from "axios";

class OrderApi {
  constructor(private readonly client: AxiosInstance) {}

  public async list(params: {
    page?: number;
    limit?: number;
    sort?: DataTableSortStatus<AdminOrderResponse>;
    search?: string;
  }): Promise<AxiosResponse<DatatableResponse<AdminOrderResponse>>> {
    return await this.client.get("/admin/order", { params });
  }
}

export default OrderApi;
