import { PromptpayManualInput } from "@pawpal/shared";
import { AxiosInstance, AxiosResponse } from "axios";

class PaymentGatewayApi {
  constructor(private readonly client: AxiosInstance) {}

  public async getGateway(id: string): Promise<AxiosResponse<any>> {
    return await this.client.get(`/payment-gateway/${id}`);
  }

  public async updatePromptpayManualMetadata(
    metadata: PromptpayManualInput
  ): Promise<AxiosResponse<any>> {
    return await this.client.patch(
      `/payment-gateway/promptpayManualMetadata`,
      metadata
    );
  }
}

export default PaymentGatewayApi;
