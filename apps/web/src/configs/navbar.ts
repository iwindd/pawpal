import { getRoute } from "./route";

export const HOME_PAGE = getRoute("home");

const navbarLinks = [
  getRoute("products"),
  getRoute("products.games"),
  getRoute("products.prepaid-card"),
  getRoute("topup"),
];

export default navbarLinks;
