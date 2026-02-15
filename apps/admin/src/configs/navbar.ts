import {
  IconAppWindow,
  IconBrandFacebook,
  IconDashboard,
  IconFolder,
  IconShoppingBag,
  IconUser,
  IconWork,
} from "@pawpal/icons";
import { getPath } from "./route";

export interface NavLink {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  link?: string;
  files: {
    id: number;
    name: string;
    link: string;
    badgeKey?: string;
  }[];
  hasBorderBottom?: boolean;
}

export const navlinks: NavLink[] = [
  {
    id: 1,
    icon: IconDashboard,
    title: "home",
    link: getPath("home"),
    files: [],
    hasBorderBottom: true,
  },
  {
    id: 3,
    icon: IconWork,
    title: "job.main",
    link: getPath("job"),
    files: [
      {
        id: 1,
        name: "orders.main",
        link: getPath("job.orders"),
      },
      {
        id: 2,
        name: "transactions.main",
        link: getPath("job.transactions"),
      },
    ],
  },
  {
    id: 4,
    icon: IconShoppingBag,
    title: "groups.product",
    files: [
      {
        id: 0,
        name: "products.main",
        link: getPath("products"),
      },
      {
        id: 1,
        name: "tags.main",
        link: getPath("tags"),
      },
      {
        id: 2,
        name: "categories.main",
        link: getPath("categories"),
      },
    ],
  },
  {
    id: 5,
    icon: IconUser,
    title: "users.main",
    link: "#",
    files: [
      {
        id: 1,
        name: "users.customer.main",
        link: getPath("users.customers"),
      },
      {
        id: 2,
        name: "users.employee.main",
        link: getPath("users.employees"),
      },
    ],
  },
  {
    id: 6,
    icon: IconAppWindow,
    title: "website.main",
    link: getPath("website"),
    files: [
      {
        id: 1,
        name: "website.carousel.main",
        link: getPath("website.carousel"),
        badgeKey: "carousels",
      },
      {
        id: 2,
        name: "website.payment.main",
        link: getPath("website.payment"),
      },
    ],
  },
  {
    id: 7,
    icon: IconFolder,
    title: "resources",
    link: getPath("resources"),
    files: [],
  },
];

export const othersNavlinks: NavLink[] = [
  {
    id: 11,
    title: "fanpage",
    link: "/",
    files: [],
    icon: IconBrandFacebook,
  },
];
