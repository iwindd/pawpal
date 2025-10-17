import ROUTES from "@/route";
import { findActiveRoute } from "@pawpal/shared";
import { usePathname } from "next/navigation";

export function useActiveRouteConfig() {
  const pathname = usePathname();
  const activeRoute = findActiveRoute(pathname, ROUTES);
  return activeRoute;
}
