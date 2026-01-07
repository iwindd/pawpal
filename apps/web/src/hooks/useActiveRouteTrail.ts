import { findRouteTrail } from "@/configs/route";
import { usePathname } from "next/navigation";

export function useActiveRouteTrail() {
  const pathname = usePathname();
  const trail = findRouteTrail(pathname);
  return trail ?? [];
}
