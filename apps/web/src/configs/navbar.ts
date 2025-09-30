import { RouteItem, ROUTES } from "./route";

interface NavbarLink extends RouteItem {}

// Mockup : This is a mockup of the navbar links
const navbarLinks: NavbarLink[] = [
  ROUTES.home as NavbarLink,
  ROUTES.products as NavbarLink,
  ROUTES.topup as NavbarLink,
  ROUTES.help as NavbarLink,
];

export default navbarLinks;
