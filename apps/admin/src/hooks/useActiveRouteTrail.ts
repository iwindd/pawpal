import { ROUTES, RouteItem } from "@/configs/route";
import { usePathname } from "next/navigation";

function pathMatches(routePath: string, pathname: string) {
  const routeSegments = routePath.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);

  if (routeSegments.length !== pathSegments.length) return false;

  return routeSegments.every(
    (seg, i) => seg.startsWith(":") || seg === pathSegments[i],
  );
}

function findRouteTrail(
  pathname: string,
  routes: Record<string, RouteItem>,
  trail: RouteItem[] = [],
): RouteItem[] | null {
  for (const key in routes) {
    const route = routes[key] as RouteItem;
    const currentTrail = [...trail, route];

    console.log(
      pathname,
      route.path,
      pathname === route.path,
      pathname.startsWith(route.path + "/"),
    );
    if (
      pathMatches(route.path, pathname) ||
      pathname.startsWith(route.path + "/")
    ) {
      if (route.children) {
        const childTrail = findRouteTrail(
          pathname,
          route.children,
          currentTrail,
        );
        if (childTrail) return childTrail;
      }
      return currentTrail;
    }
  }
  return null;
}

export function useActiveRouteTrail() {
  const pathname = usePathname();
  const trail = findRouteTrail(pathname, ROUTES);
  return trail ?? [];
}
