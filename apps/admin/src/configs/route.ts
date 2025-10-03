import { IconFolder, IconHome, IconLogin, IconWork } from "@pawpal/icons";

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
  products: {
    path: "/products",
    label: "products",
    icon: IconWork,
    children: {
      create: {
        path: "/products/create",
        label: "products.create",
        icon: IconWork,
      },
      edit: {
        path: "/products/:slug/edit",
        label: "products.edit",
        icon: IconWork,
      },
    },
  },
  resources: {
    path: "/resources",
    label: "resources",
    icon: IconFolder,
  },
};
