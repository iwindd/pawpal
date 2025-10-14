import { cookies } from "next/headers";
import PawApi from "../api";
import AuthApi from "./services/Auth";
import CarouselApi from "./services/Carousel";
import OrderApi from "./services/Order";
import ProductApi from "./services/Product";

export class ServerApi extends PawApi {
  public readonly auth: AuthApi;
  public readonly carousel: CarouselApi;
  public readonly product: ProductApi;
  public readonly order: OrderApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
    this.carousel = new CarouselApi(this.client);
    this.product = new ProductApi(this.client);
    this.order = new OrderApi(this.client);
  }
}

const APISession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return new ServerApi(token);
};

export default APISession;
