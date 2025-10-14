import { IconFolder, IconHome, IconLogin, IconWork } from "@pawpal/icons";

export type RouteItem = {
  path: string;
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

function fillPathParams<T extends Record<string, any>>(
  path: string,
  params: T
): string {
  return path.replace(/:([a-zA-Z]+)/g, (_, key) => {
    const value = params[key];
    if (!value) throw new Error(`Missing param: ${key}`);
    return value;
  });
}

export const pather = (
  routeName: string,
  params?: Record<string, any>
): string => {
  const paths: string[] = routeName.split(".");
  if (!paths) throw new Error(`invalid_path: ${routeName}`);
  if (paths.length <= 0) throw new Error(`invalid_path: ${routeName}`);
  let currentPathKey = paths[0] as string;
  let currentPath = ROUTES[currentPathKey];
  paths.shift();

  if (paths.length > 0) {
    paths.forEach((value) => {
      const children = currentPath?.children || {};
      if (!children[value])
        throw new Error(
          `path "${currentPathKey}" not have children (${value}). (${routeName})`
        );

      currentPathKey += `.${value}`;
      currentPath = children[value];
    });
  }

  if (!currentPath) throw Error(`invalid_path: ${routeName}`);

  return fillPathParams<any>(currentPath.path, params);
};
