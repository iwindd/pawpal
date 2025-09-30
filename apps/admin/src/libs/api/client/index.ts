import PawApi from "../api";
import AuthApi from "../services/Auth";

class ClientApi extends PawApi {
  public readonly auth: AuthApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
  }
}

const API = new ClientApi();

export default API;
