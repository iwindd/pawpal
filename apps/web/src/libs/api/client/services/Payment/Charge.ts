import { PaymentChargeCreateInput } from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";
import { PaymentChargeCreatedResponse } from "../../../../../../../../packages/shared/dist";

class PaymentChargeApi {
  constructor(private readonly client: AxiosInstance) {}

  async create(
    payload: PaymentChargeCreateInput
  ): Promise<AxiosResponse<PaymentChargeCreatedResponse>> {
    return this.client.post("/payment/topup", payload);
  }
}

export default PaymentChargeApi;
