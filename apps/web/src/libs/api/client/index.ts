import PawApi from "../api";
import AuthApi from "./services/Auth";
import OrderApi from "./services/Order";
import PaymentApi from "./services/Payment";
import ProductApi from "./services/Product";

class ClientApi extends PawApi {
  public readonly auth: AuthApi;
  public readonly payment: PaymentApi;
  public readonly product: ProductApi;
  public readonly order: OrderApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
    this.payment = new PaymentApi(this.client);
    this.product = new ProductApi(this.client);
    this.order = new OrderApi(this.client);
  }
}

const API = new ClientApi();

export default API;
