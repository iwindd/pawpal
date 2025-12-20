import { RouteItem, ROUTES } from "./route";

interface NavbarLink extends RouteItem {}

const navbarLinks: NavbarLink[] = [
  ROUTES.home as NavbarLink,
  ROUTES.products as NavbarLink,
  ROUTES.topup as NavbarLink,
];

export default navbarLinks;
