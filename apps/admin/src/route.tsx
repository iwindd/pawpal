import {
  IconFolder,
  IconHome,
  IconLogin,
  IconUser,
  IconWork,
} from "@pawpal/icons";
import { ROUTER } from "@pawpal/shared";

const ROUTES = ROUTER({
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
  job: {
    path: "/job",
    label: "job.main",
    icon: IconWork,
    children: {
      orders: {
        path: "/job/orders",
        label: "orders.main",
        icon: IconWork,
        children: {
          edit: {
            path: "/job/orders/:id",
            label: "orders.edit",
            icon: IconWork,
          },
        },
      },
      transactions: {
        path: "/job/transactions",
        label: "transactions.main",
        icon: IconWork,
        children: {},
      },
    },
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
        children: {
          information: {
            path: "/products/:id/information",
            label: "products.information",
            name: "products.information",
            icon: IconWork,
          },
          packages: {
            path: "/products/:id/packages",
            label: "products.packages",
            name: "products.packages",
            icon: IconWork,
          },
          fields: {
            path: "/products/:id/fields",
            label: "products.fields",
            name: "products.fields",
            icon: IconWork,
          },
        },
      },
    },
  },
  resources: {
    path: "/resources",
    label: "resources",
    icon: IconFolder,
  },
  users: {
    path: "/users",
    label: "users.main",
    icon: IconUser,
    children: {
      customers: {
        path: "/users/customers",
        label: "users.customer",
      },
      employees: {
        path: "/users/employees",
        label: "users.employee",
      },
    },
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
});

export default ROUTES;
