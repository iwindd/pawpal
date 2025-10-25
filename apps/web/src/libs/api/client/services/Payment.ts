import { AxiosError, AxiosInstance } from "axios";

class PaymentApi {
  constructor(private readonly client: AxiosInstance) {}

  async topup(amount: number, paymentMethod: string) {
    try {
      const resp = await this.client.post("/payment/topup", {
        amount: amount,
        payment_method: paymentMethod,
      });

      return { success: true, data: resp.data };
    } catch (error) {
      return { success: false, data: error as AxiosError };
    }
  }
}

export default PaymentApi;