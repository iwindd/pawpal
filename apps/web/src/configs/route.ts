import ROUTES from "@/route";
import { buildRouteUtility } from "@pawpal/shared";

export const { getRoute, getPath, findRouteTrail, findActiveRoute } =
  buildRouteUtility(ROUTES);
