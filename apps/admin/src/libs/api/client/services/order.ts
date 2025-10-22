import {
  AdminOrderResponse,
  DatatableInput,
  DatatableResponse,
} from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class OrderApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getTopupOrders(
    params: DatatableInput
  ): Promise<AxiosResponse<DatatableResponse<AdminOrderResponse>>> {
    return await this.client.get("/admin/order/topup", { params });
  }
}

export default OrderApi;
