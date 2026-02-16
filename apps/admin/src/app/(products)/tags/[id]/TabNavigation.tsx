"use client";
import { getPath, getRoute } from "@/configs/route";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { Tabs } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useTag } from "./TagContext";

const Tab = ({ routeName }: { routeName: string }) => {
  const route = getRoute(routeName);
  const { tag } = useTag();
  const __ = useTranslations("Routes");

  return (
    <Tabs.Tab
      value={route.name}
      component={Link}
      // @ts-ignore
      href={getPath(route.name, { id: tag.id })}
    >
      {__(route.label)}
    </Tabs.Tab>
  );
};

const TabNavigation = () => {
  const activeRoute = useActiveRouteConfig();

  return (
    <Tabs mb="xs" value={activeRoute?.name}>
      <Tabs.List>
        <Tab routeName={"tags.edit"} />
        <Tab routeName={"tags.products"} />
      </Tabs.List>
    </Tabs>
  );
};

export default TabNavigation;
