import { compile, match } from "./path";

export type CFG_ROUTE = {
  path: string;
  label: string;
  name?: string;
  icon?: any;
  children?: Record<string, CFG_ROUTE>;
  parent?: string;
};

export type Route = {
  path: string;
  label: string;
  name: string;
  icon?: any;
  parent?: string;
};

export const ROUTER = (
  ROUTES: Record<string, CFG_ROUTE>
): Record<string, Route> => {
  const APP_ROUTES: Record<string, Route> = {};

  function traverse(
    routes: Record<string, CFG_ROUTE>,
    parentKey: string | null = null
  ) {
    for (const key in routes) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const routeName = routes[key]!.name || fullKey;
      routes[key]!.name = routeName;

      const route = {
        ...routes[key]!,
        name: routeName,
        label: routes[key]!.label || routeName,
        parent: parentKey,
      } as Route;

      delete (route as CFG_ROUTE).children;
      APP_ROUTES[fullKey] = route;

      if (routes[key]!.children) traverse(routes[key]!.children, fullKey);
    }
  }

  traverse({ ...ROUTES });

  return APP_ROUTES;
};

export const findRouteTrail = (
  pathname: string,
  routes: Record<string, Route>
): Route[] | null => {
  for (const key in routes) {
    const route = routes[key] as Route;
    const matcher = match(route.path);

    if (matcher(pathname)) {
      const trail: Route[] = [route];

      let parentKey = route.parent;
      while (parentKey) {
        const parentRoute = routes[parentKey];
        if (parentRoute) {
          trail.unshift(parentRoute);
          parentKey = parentRoute.parent;
        } else {
          break;
        }
      }

      return trail;
    }
  }
  return null;
};

export const findActiveRoute = (
  pathname: string,
  routes: Record<string, Route>
): Route | null => {
  for (const route of Object.values(routes)) {
    const matcher = match(route.path);
    if (matcher(pathname)) return route;
  }
  return null;
};

export const patherBase = (
  routeName: string,
  ROUTES: Record<string, Route>,
  params?: Record<string, any>
): string => {
  const route = ROUTES[routeName];
  if (!route) throw new Error(`Route not found: ${routeName}`);

  const toPath = compile(route.path);
  return toPath(params || {}) as string;
};
