import { PurchaseInput } from "@pawpal/shared";
import { AxiosError, AxiosInstance } from "axios";

class OrderApi {
  constructor(private readonly client: AxiosInstance) {}

  async createOrder(order: PurchaseInput) {
    try {
      const response = await this.client.post("/order", order);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }
}

export default OrderApi;
