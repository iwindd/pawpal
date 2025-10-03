import PawApi from "../api";
import AuthApi from "./services/Auth";
import ProductApi from "./services/product";
import ResourceApi from "./services/Resource";

class ClientApi extends PawApi {
  public readonly auth: AuthApi;
  public readonly product: ProductApi;
  public readonly resource: ResourceApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
    this.product = new ProductApi(this.client);
    this.resource = new ResourceApi(this.client);
  }
}

const API = new ClientApi();

export default API;
