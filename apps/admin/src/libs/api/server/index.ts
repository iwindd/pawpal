import { cookies } from "next/headers";
import PawApi from "../api";
import AuthApi from "./services/Auth";
import CarouselApi from "./services/Carousel";
import CategoryApi from "./services/Category";
import OrderApi from "./services/Order";
import ProductApi from "./services/Product";
import ProductTagApi from "./services/ProductTag";
import TransactionApi from "./services/Transaction";
import UserApi from "./services/User";

export class ServerApi extends PawApi {
  public readonly auth: AuthApi;
  public readonly carousel: CarouselApi;
  public readonly category: CategoryApi;
  public readonly product: ProductApi;
  public readonly productTag: ProductTagApi;
  public readonly order: OrderApi;
  public readonly transaction: TransactionApi;
  public readonly user: UserApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
    this.carousel = new CarouselApi(this.client);
    this.category = new CategoryApi(this.client);
    this.product = new ProductApi(this.client);
    this.productTag = new ProductTagApi(this.client);
    this.order = new OrderApi(this.client);
    this.transaction = new TransactionApi(this.client);
    this.user = new UserApi(this.client);
  }
}

const APISession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return new ServerApi(token);
};

export default APISession;
