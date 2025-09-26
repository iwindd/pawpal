import PawApi from "../api";
import AuthApi from "./services/Auth";
import PaymentApi from "./services/Payment";

class ClientApi extends PawApi {
  public readonly auth: AuthApi;
  public readonly payment: PaymentApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
    this.payment = new PaymentApi(this.client);
  }
}

const API = new ClientApi();

export default API;
