import ROUTES from "@/route";
import { findRouteTrail } from "@pawpal/shared";
import { usePathname } from "next/navigation";

export function useActiveRouteTrail() {
  const pathname = usePathname();
  const trail = findRouteTrail(pathname, ROUTES);
  return trail ?? [];
}
