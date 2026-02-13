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
  profile: {
    path: "/profile",
    label: "profile.edit",
    icon: IconUser,
    children: {
      orders: {
        path: "/profile/orders",
        label: "profile.orders",
      },
      topups: {
        path: "/profile/topups",
        label: "profile.topups",
      },
    },
  },
  job: {
    path: "/job",
    label: "job.main",
    icon: IconWork,
    disabled: true,
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
      tags: {
        path: "/products/tags",
        label: "products.tags.main",
        icon: IconWork,
        children: {
          edit: {
            path: "/products/tags/:id",
            label: "products.tags.edit",
            icon: IconWork,
          },
          products: {
            path: "/products/tags/:id/products",
            label: "products.tags.products",
            icon: IconWork,
          },
        },
      },
      categories: {
        path: "/products/categories",
        label: "products.categories.main",
        icon: IconWork,
        children: {
          create: {
            path: "/products/categories/create",
            label: "products.categories.create",
            icon: IconWork,
          },
          edit: {
            path: "/products/categories/:id",
            label: "products.categories.edit",
            icon: IconWork,
          },
          products: {
            path: "/products/categories/:id/products",
            label: "products.categories.products",
            icon: IconWork,
          },
        },
      },
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
    disabled: true,
    children: {
      customers: {
        path: "/users/customers",
        label: "users.customer.main",
        children: {
          edit: {
            path: "/users/customers/:id",
            label: "users.customer.edit",
            children: {},
          },
          orders: {
            path: "/users/customers/:id/orders",
            label: "users.customer.orders",
          },
          topups: {
            path: "/users/customers/:id/topups",
            label: "users.customer.topups",
          },
        },
      },
      employees: {
        path: "/users/employees",
        label: "users.employee.main",
        children: {
          edit: {
            path: "/users/employees/:id",
            label: "users.employee.edit",
          },
          orders: {
            path: "/users/employees/:id/orders",
            label: "users.employee.orders",
          },
          topups: {
            path: "/users/employees/:id/topups",
            label: "users.employee.topups",
          },
        },
      },
    },
  },
  website: {
    path: "/website",
    label: "website.main",
    icon: IconWork,
    disabled: true,
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
      payment: {
        path: "/website/payment",
        label: "website.payment.main",
        icon: IconWork,
        children: {
          promptpayManual: {
            path: "/website/payment/promptpay-manual",
            label: "website.payment.promptpayManual.main",
            icon: IconWork,
          },
          walletVoucher: {
            path: "/website/payment/wallet-voucher",
            label: "website.payment.walletVoucher.main",
            icon: IconWork,
          },
        },
      },
    },
  },
});

export default ROUTES;
