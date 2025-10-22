import PawApi from "../api";
import AuthApi from "./services/Auth";
import CarouselApi from "./services/Carousel";
import CategoryApi from "./services/category";
import FieldApi from "./services/Field";
import OrderApi from "./services/order";
import PackageApi from "./services/Package";
import ProductApi from "./services/product";
import ResourceApi from "./services/Resource";
import TransactionApi from "./services/Transaction";
import UserApi from "./services/user";

class ClientApi extends PawApi {
  public readonly auth: AuthApi;
  public readonly category: CategoryApi;
  public readonly product: ProductApi;
  public readonly resource: ResourceApi;
  public readonly carousel: CarouselApi;
  public readonly order: OrderApi;
  public readonly package: PackageApi;
  public readonly field: FieldApi;
  public readonly user: UserApi;
  public readonly transaction: TransactionApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
    this.category = new CategoryApi(this.client);
    this.product = new ProductApi(this.client);
    this.resource = new ResourceApi(this.client);
    this.carousel = new CarouselApi(this.client);
    this.order = new OrderApi(this.client);
    this.package = new PackageApi(this.client);
    this.field = new FieldApi(this.client);
    this.user = new UserApi(this.client);
    this.transaction = new TransactionApi(this.client);
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
