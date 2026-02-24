"use client";
import { getRoute } from "@/configs/route";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { useAppRouter } from "@/hooks/useAppRouter";
import { SegmentedControl } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const TabNavigation = () => {
  const activeRoute = useActiveRouteConfig();
  const appRouter = useAppRouter();
  const [segmentItems] = useState([
    getRoute("users.customers.histories.orders"),
    getRoute("users.customers.histories.topups"),
    getRoute("users.customers.histories.suspensions"),
  ]);
  const t = useTranslations("Routes");
  const handleChange = (value: string) => appRouter.push(value);

  useEffect(() => {
    segmentItems.map((route) => {
      appRouter.raw.prefetch(route.path);
    });
  }, [appRouter, segmentItems]);

  const activeSegment = segmentItems.find(
    (route) => route.name === (activeRoute?.name || segmentItems[0]?.name),
  )!;

  return (
    <SegmentedControl
      value={activeSegment?.name}
      onChange={handleChange}
      data={segmentItems.map((route) => ({
        value: route.name,
        label: t(route.label),
      }))}
    />
  );
};

export default TabNavigation;
