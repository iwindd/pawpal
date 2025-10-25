import { PaymentGatewayResponse } from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class PaymentGatewayApi {
  constructor(private readonly client: AxiosInstance) {}

  async findAllActive(): Promise<AxiosResponse<PaymentGatewayResponse[]>> {
    return await this.client.get("/payment-gateway");
  }
}

export default PaymentGatewayApi;
