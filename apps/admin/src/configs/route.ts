import ROUTES from "@/route";
import { patherBase } from "@pawpal/shared";

export const pather = (
  routeName: string,
  params?: Record<string, any>
): string => patherBase(routeName, ROUTES, params);
