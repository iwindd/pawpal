import {
  IconBrandFacebook,
  IconDashboard,
  IconFolder,
  IconShoppingBag,
  IconWork,
} from "@pawpal/icons";
import { ROUTES } from "./route";

export interface NavLink {
  id: number;
  icon: React.ComponentType<any>;
  title: string;
  link: string | ((...args: any[]) => string);
  files: {
    id: number;
    name: string;
    link: string;
    noti: number;
  }[];
  hasBorderBottom?: boolean;
}

export const navlinks: NavLink[] = [
  {
    id: 1,
    icon: IconDashboard,
    title: "home",
    link: ROUTES["home"]?.path as string,
    files: [],
    hasBorderBottom: true,
  },
  {
    id: 3,
    icon: IconWork,
    title: "work.main",
    link: "/",
    files: [
      {
        id: 1,
        name: "work.order",
        link: "/",
        noti: 0,
      },
      {
        id: 2,
        name: "work.topup",
        link: "/",
        noti: 0,
      },
    ],
  },
  {
    id: 4,
    icon: IconShoppingBag,
    title: "products",
    link: ROUTES["products"]?.path as string,
    files: [],
  },
  {
    id: 5,
    icon: IconFolder,
    title: "resources",
    link: ROUTES["resources"]?.path as string,
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
