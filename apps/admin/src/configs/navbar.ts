import {
  IconCarouselHorizontalFilled,
  IconCategoryFilled,
  IconCreditCardFilled,
  IconDashboardFilled,
  IconFolderFilled,
  IconReceiptDollarFilled,
  IconReceiptFilled,
  IconRoleFilled,
  IconShieldCheckFilled,
  IconShoppingCartFilled,
  IconTagsFilled,
  IconUserFilled,
} from "@pawpal/icons";
import { Route } from "@pawpal/shared";
import { getRoute } from "./route";

export type NavLink = NavbarFolder | NavbarItem;

export class NavbarItem {
  constructor(
    public route: Route,
    public icon?: React.ComponentType<any>,
    public notification?: string,
  ) {}
}

export class NavbarFolder {
  constructor(
    public name: string,
    public items: NavbarItem[],
  ) {}
}

export const folder = (name: string, items: NavbarItem[]) => {
  return new NavbarFolder(name, items);
};

export const item = (
  routeName: string,
  {
    icon,
    notification,
  }: { icon?: React.ComponentType<any>; notification?: string } = {},
) => {
  return new NavbarItem(getRoute(routeName), icon, notification);
};

export const navlinks: NavLink[] = [
  folder("overview", [item("home", { icon: IconDashboardFilled })]),
  folder("job", [
    item("job.orders", { icon: IconReceiptFilled }),
    item("job.transactions", { icon: IconReceiptDollarFilled }),
  ]),
  folder("product", [
    item("products", { icon: IconShoppingCartFilled }),
    item("tags", { icon: IconTagsFilled }),
    item("categories", { icon: IconCategoryFilled }),
  ]),
  folder("user", [
    item("users.customers", { icon: IconUserFilled }),
    item("users.employees", { icon: IconShieldCheckFilled }),
  ]),
  folder("website", [
    item("website.carousel", { icon: IconCarouselHorizontalFilled }),
    item("website.payment", { icon: IconCreditCardFilled }),
  ]),
  folder("misc", [
    item("roles", { icon: IconRoleFilled }),
    item("resources", { icon: IconFolderFilled }),
  ]),
];
