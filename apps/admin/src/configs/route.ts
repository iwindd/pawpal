import ROUTES from "@/route";
import {
  getPath as getBasePath,
  getRoute as getBaseRoute,
} from "@pawpal/shared";

export const getRoute = (routeName: string) => getBaseRoute(routeName, ROUTES);

export const getPath = (
  routeName: string,
  params?: Record<string, any>
): string => getBasePath(routeName, ROUTES, params);

/** @deprecated Use getPath instead */
export const pather = (
  routeName: string,
  params?: Record<string, any>
): string => getBasePath(routeName, ROUTES, params);
