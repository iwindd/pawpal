import { middlewareRegistry } from "./registry";
import { RouteDefinition, RouteGroup } from "./types";

/**
 * Get middleware for a specific route
 */
export function getMiddlewareForRoute(
  pathname: string,
  routes: RouteDefinition[],
  routeGroups: RouteGroup[] = []
): string[] {
  // Find exact match first
  const exactMatch = routes.find((route) => route.path === pathname);
  if (exactMatch) {
    return exactMatch.middleware || [];
  }

  // Find pattern match
  const patternMatch = routes.find((route) => {
    if (route.path.includes("*")) {
      const pattern = route.path.replace(/\*/g, ".*");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return false;
  });

  if (patternMatch) {
    return patternMatch.middleware || [];
  }

  // Check route groups
  for (const group of routeGroups) {
    if (pathname.startsWith(group.prefix || "")) {
      const groupMiddleware = group.middleware || [];

      // Find specific route within group
      const groupRoute = group.routes.find((route: RouteDefinition) => {
        const fullPath = (group.prefix || "") + route.path;
        if (route.path.includes("*")) {
          const pattern = fullPath.replace(/\*/g, ".*");
          const regex = new RegExp(`^${pattern}$`);
          return regex.test(pathname);
        }
        return fullPath === pathname;
      });

      if (groupRoute) {
        return [...groupMiddleware, ...(groupRoute.middleware || [])];
      }

      return groupMiddleware;
    }
  }

  // Return global middleware
  return middlewareRegistry.getGlobal().map((m) => m.name);
}

/**
 * Helper function to create route definitions
 */
export function createRoute(
  path: string,
  middleware: string[] = [],
  options: Partial<RouteDefinition> = {}
): RouteDefinition {
  return {
    path,
    middleware,
    ...options,
  };
}

/**
 * Helper function to create route groups
 */
export function createRouteGroup(
  prefix: string,
  routes: RouteDefinition[],
  middleware: string[] = [],
  options: Partial<RouteGroup> = {}
): RouteGroup {
  return {
    prefix,
    routes,
    middleware,
    ...options,
  };
}
