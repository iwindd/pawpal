"use client";
import { getRoute } from "@/configs/route";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { useAppRouter } from "@/hooks/useAppRouter";
import { Tabs } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useProduct } from "./ProductContext";

const Tab = ({ routeName }: { routeName: string }) => {
  const route = getRoute(routeName);
  const { product } = useProduct();
  const __ = useTranslations("Routes");
  const appRouter = useAppRouter();

  return (
    <Tabs.Tab
      value={route.name}
      component={Link}
      // @ts-ignore (idk why warning error is here)
      href={appRouter.path(route.name)}
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
        <Tab routeName={"products.product"} />
        <Tab routeName={"products.packages"} />
        <Tab routeName={"products.fields"} />
      </Tabs.List>
    </Tabs>
  );
};

export default TabNavigation;
