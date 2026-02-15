"use client";
import { getPath, getRoute } from "@/configs/route";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { Tabs } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useProductTag } from "./ProductTagContext";

const Tab = ({ routeName }: { routeName: string }) => {
  const route = getRoute(routeName);
  const { productTag } = useProductTag();
  const __ = useTranslations("Navbar.links");

  return (
    <Tabs.Tab
      value={route.name}
      component={Link}
      // @ts-ignore
      href={getPath(route.name, { id: productTag.id })}
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
