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
import { ROUTER } from "@pawpal/shared";

const ROUTES = ROUTER({
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
        // disabled
        // TODO:: Create activity page
      },
    },
  },
  products: {
    path: "/products",
    label: "products",
    icon: IconShoppingBag,
    children: {
      detail: {
        path: "/products/:slug", // dynamic route
        label: "productDetail",
      },
    },
  },
  help: {
    path: "/help",
    label: "help",
    icon: IconHelp,
    // disabled
    // TODO:: Create help page
  },
});

export default ROUTES;
