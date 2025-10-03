import { ROUTES, RouteItem } from "@/configs/route";
import { usePathname } from "next/navigation";

function findActiveRoute(
  pathname: string,
  routes: Record<string, RouteItem>
): RouteItem | null {
  for (const key in routes) {
    const route = routes[key] as RouteItem;
    if (typeof route.path === "string") {
      if (pathname === route.path || pathname.startsWith(route.path + "/")) {
        return route;
      }
    }
    if (route.children) {
      const child = findActiveRoute(pathname, route.children);
      if (child) return child;
    }
  }
  return null;
}

export function useActiveRouteConfig() {
  const pathname = usePathname();
  const activeRoute = findActiveRoute(pathname, ROUTES);
  return activeRoute;
}
