import { ROUTES, RouteItem } from "@/configs/route";
import { usePathname } from "next/navigation";

function findRouteTrail(
  pathname: string,
  routes: Record<string, RouteItem>,
  trail: RouteItem[] = []
): RouteItem[] | null {
  for (const key in routes) {
    const route = routes[key] as RouteItem;
    const currentTrail = [...trail, route];

    if (typeof route.path === "string") {
      if (pathname === route.path || pathname.startsWith(route.path + "/")) {
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
  }
  return null;
}

export function useActiveRouteTrail() {
  const pathname = usePathname();
  const trail = findRouteTrail(pathname, ROUTES);
  return trail ?? [];
}
