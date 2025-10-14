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
    label: "products.main",
    icon: IconWork,
    children: {
      create: {
        path: "/products/create",
        label: "products.create",
        icon: IconWork,
      },
      edit: {
        path: "/products/:id",
        label: "products.edit",
        icon: IconWork,
      },
    },
  },
  orders: {
    path: "/orders",
    label: "orders.main",
    icon: IconWork,
  },
  resources: {
    path: "/resources",
    label: "resources",
    icon: IconFolder,
  },
  website: {
    path: "/website",
    label: "website.main",
    icon: IconWork,
    children: {
      carousel: {
        path: "/website/carousel",
        label: "website.carousel.main",
        children: {
          create: {
            path: "/website/carousel/create",
            label: "website.carousel.create",
            icon: IconWork,
          },
          edit: {
            path: "/website/carousel/:id",
            label: "website.carousel.edit",
            icon: IconWork,
          },
        },
      },
    },
  },
};
