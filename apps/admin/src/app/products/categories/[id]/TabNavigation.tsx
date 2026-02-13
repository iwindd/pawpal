"use client";
import { getPath, getRoute } from "@/configs/route";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { Tabs } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useCategory } from "./CategoryContext";

const Tab = ({ routeName }: { routeName: string }) => {
  const route = getRoute(routeName);
  const { category } = useCategory();
  const __ = useTranslations("Navbar.links");

  return (
    <Tabs.Tab
      value={route.name}
      component={Link}
      // @ts-ignore
      href={getPath(route.name, { id: category.id })}
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
        <Tab routeName={"products.categories.edit"} />
        <Tab routeName={"products.categories.products"} />
      </Tabs.List>
    </Tabs>
  );
};

export default TabNavigation;
