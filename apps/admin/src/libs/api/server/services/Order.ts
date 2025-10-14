import { AdminOrderResponse } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";
import { PawApiResponse } from "../../../../../../web/src/libs/api/api";

class OrderApi {
  constructor(private readonly client: AxiosInstance) {}

  async getOrder(id: string): Promise<PawApiResponse<AdminOrderResponse>> {
    try {
      const response = await this.client.get<AdminOrderResponse>(
        `admin/order/${id}`
      );
      return {
        success: true,
        data: response.data,
      } as PawApiResponse<AdminOrderResponse>;
    } catch (error) {
      return {
        success: false,
        data: error as AxiosError,
      };
    }
  }
}

export default OrderApi;
