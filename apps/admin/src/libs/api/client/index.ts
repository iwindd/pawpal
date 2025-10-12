import PawApi from "../api";
import AuthApi from "./services/Auth";
import CarouselApi from "./services/Carousel";
import ProductApi from "./services/product";
import ResourceApi from "./services/Resource";

class ClientApi extends PawApi {
  public readonly auth: AuthApi;
  public readonly product: ProductApi;
  public readonly resource: ResourceApi;
  public readonly carousel: CarouselApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
    this.product = new ProductApi(this.client);
    this.resource = new ResourceApi(this.client);
    this.carousel = new CarouselApi(this.client);
  }

  public async getNotifications(): Promise<Record<string, number>> {
    try {
      const response = await this.client.get(`/admin/notification`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      return {};
    }
  }
}

const API = new ClientApi();

export default API;
