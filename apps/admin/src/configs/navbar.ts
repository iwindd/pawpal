import {
  IconAppWindow,
  IconBrandFacebook,
  IconDashboard,
  IconFolder,
  IconShoppingBag,
  IconUser,
  IconWork,
} from "@pawpal/icons";
import { getPath, pather } from "./route";

export interface NavLink {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  link: string | ((...args: any[]) => string);
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
    link: pather("home"),
    files: [],
    hasBorderBottom: true,
  },
  {
    id: 3,
    icon: IconWork,
    title: "job.main",
    link: pather("job"),
    files: [
      {
        id: 1,
        name: "orders.main",
        link: pather("job.orders"),
      },
    ],
  },
  {
    id: 4,
    icon: IconShoppingBag,
    title: "products.main",
    link: pather("products"),
    files: [],
  },
  {
    id: 5,
    icon: IconUser,
    title: "users.main",
    link: "#",
    files: [
      {
        id: 1,
        name: "users.customer",
        link: getPath("users.customers"),
      },
      {
        id: 2,
        name: "users.employee",
        link: getPath("users.employees"),
      },
    ],
  },
  {
    id: 6,
    icon: IconAppWindow,
    title: "website.main",
    link: pather("website"),
    files: [
      {
        id: 1,
        name: "website.carousel.main",
        link: pather("website.carousel"),
        badgeKey: "carousels",
      },
    ],
  },
  {
    id: 7,
    icon: IconFolder,
    title: "resources",
    link: pather("resources"),
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
