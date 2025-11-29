import { AxiosInstance } from "axios";
import PaymentChargeApi from "./Charge";
import PaymentGatewayApi from "./Gateways";

class PaymentApi {
  public readonly gateway: PaymentGatewayApi;
  public readonly charge: PaymentChargeApi;

  constructor(private readonly client: AxiosInstance) {
    this.gateway = new PaymentGatewayApi(client);
    this.charge = new PaymentChargeApi(client);
  }
}

export default PaymentApi;
