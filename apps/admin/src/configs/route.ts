import { IconHome, IconLogin } from "@pawpal/icons";

export type RouteItem = {
  path: string | ((...args: any[]) => string);
  label: string;
  icon?: React.ComponentType<any>;
  children?: Record<string, RouteItem>;
};

export const ROUTES: Record<string, RouteItem> = {
  home: {
    path: "/",
    label: "home",
    icon: IconHome,
  },
  login: {
    path: "/login",
    label: "login",
    icon: IconLogin,
  },
};
