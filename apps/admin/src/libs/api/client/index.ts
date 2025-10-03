import PawApi from "../api";
import AuthApi from "./services/Auth";
import ProductApi from "./services/product";

class ClientApi extends PawApi {
  public readonly auth: AuthApi;
  public readonly product: ProductApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
    this.product = new ProductApi(this.client);
  }
}

const API = new ClientApi();

export default API;
