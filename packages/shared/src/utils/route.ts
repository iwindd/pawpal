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
  children?: Record<string, Route>;
};

export const ROUTER = (
  ROUTES: Record<string, CFG_ROUTE>
): Record<string, Route> => {
  function traverse(
    routes: Record<string, CFG_ROUTE>,
    parentKey: string | null = null
  ) {
    for (const key in routes) {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      routes[key]!.name = routes[key]!.name || fullKey;

      if (routes[key]!.children) traverse(routes[key]!.children, fullKey);
    }
  }

  const newROUTES = { ...ROUTES };
  traverse(newROUTES);

  return newROUTES as Record<string, Route>;
};

export const pathMatches = (routePath: string, pathname: string) => {
  const routeSegments = routePath.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);

  if (routeSegments.length !== pathSegments.length) return false;

  return routeSegments.every(
    (seg, i) => seg.startsWith(":") || seg === pathSegments[i]
  );
};

export const findRouteTrail = (
  pathname: string,
  routes: Record<string, Route>,
  trail: Route[] = []
): Route[] | null => {
  for (const key in routes) {
    const route = routes[key] as Route;
    const currentTrail = [...trail, route];

    if (
      pathMatches(route.path, pathname) ||
      pathname.startsWith(route.path + "/")
    ) {
      if (route.children) {
        const childTrail = findRouteTrail(
          pathname,
          route.children,
          currentTrail
        );
        if (childTrail) return childTrail;
      }
      return currentTrail;
    }
  }
  return null;
};

export const findActiveRoute = (
  pathname: string,
  routes: Record<string, Route>
): Route | null => {
  const trail = findRouteTrail(pathname, routes);
  return trail?.at(-1) || null;
};

export const fillPathParams = <T extends Record<string, any>>(
  path: string,
  params: T
): string => {
  return path.replaceAll(/:([a-zA-Z]+)/g, (_, key) => {
    const value = params[key];
    if (!value) throw new Error(`Missing param: ${key}`);
    return value;
  });
};

export const patherBase = (
  routeName: string,
  ROUTES: Record<string, Route>,
  params?: Record<string, any>
): string => {
  const paths: string[] = routeName.split(".");
  if (!paths) throw new Error(`invalid_path: ${routeName}`);
  if (paths.length <= 0) throw new Error(`invalid_path: ${routeName}`);
  let currentPathKey = paths[0] as string;
  let currentPath = ROUTES[currentPathKey];
  paths.shift();

  if (paths.length > 0) {
    for (const value of paths) {
      const children = currentPath?.children || {};
      if (!children[value])
        throw new Error(
          `path "${currentPathKey}" not have children (${value}). (${routeName})`
        );

      currentPathKey += `.${value}`;
      currentPath = children[value];
    }
  }

  if (!currentPath) throw new Error(`invalid_path: ${routeName}`);

  return fillPathParams<any>(currentPath.path, params);
};
