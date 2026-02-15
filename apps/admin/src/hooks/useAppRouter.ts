"use client";

import { getPath } from "@/configs/route";
import { useParams, useRouter } from "next/navigation";

export const useAppRouter = () => {
  const router = useRouter();
  const params = useParams();

  const resolve = (routeName: string, extraParams?: Record<string, any>) => {
    return getPath(routeName, {
      ...params,
      ...extraParams,
    });
  };

  return {
    path: resolve,
    push: (routeName: string, params?: Record<string, any>) =>
      router.push(resolve(routeName, params)),
    refresh: () => router.refresh(),
    replace: (routeName: string, params?: Record<string, any>) =>
      router.replace(resolve(routeName, params)),
    raw: router,
  };
};
