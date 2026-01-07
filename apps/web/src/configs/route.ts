import {
  IconActivity,
  IconCreditCard,
  IconHelp,
  IconHistory,
  IconHome,
  IconSettings,
  IconShoppingBag,
  IconUser,
} from "@pawpal/icons";

export type RouteItem = {
  path: string | ((...args: any[]) => string);
  label: string;
  icon?: React.ComponentType<any>;
  children?: Record<string, RouteItem>;
  disabled?: boolean;
};

export const ROUTES: Record<string, RouteItem> = {
  home: {
    path: "/",
    label: "home",
    icon: IconHome,
  },
  topup: {
    path: "/topup",
    label: "topup",
    icon: IconCreditCard,
  },
  user: {
    path: "/user",
    label: "user.main",
    icon: IconUser,
    children: {
      profile: {
        path: "/user/profile",
        label: "user.profile",
        icon: IconSettings,
      },
      orders: {
        path: "/user/orders",
        label: "user.orders",
        icon: IconHistory,
      },
      topups: {
        path: "/user/topups",
        label: "user.topups",
        icon: IconHistory,
      },
      activity: {
        path: "/user/activity",
        label: "user.activity",
        icon: IconActivity,
        disabled: true,
      },
    },
  },
  products: {
    path: "/products",
    label: "products",
    icon: IconShoppingBag,
    children: {
      detail: {
        path: (slug: string) => `/products/${slug}`, // dynamic route
        label: "productDetail",
      },
    },
  },
  help: {
    path: "/help",
    label: "help",
    icon: IconHelp,
    disabled: true,
  },
};
