"use client";
import { getPath, getRoute } from "@/configs/route";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { Tabs } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Tab = ({ routeName }: { routeName: string }) => {
  const route = getRoute(routeName);
  const __ = useTranslations("Navbar.links");

  return (
    <Tabs.Tab
      value={route.name}
      component={Link}
      // @ts-ignore (idk why warning error is here)
      href={getPath(route.name)}
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
        <Tab routeName={"website.payment"} />
        <Tab routeName={"website.payment.promptpayManual"} />
        <Tab routeName={"website.payment.walletVoucher"} />
      </Tabs.List>
    </Tabs>
  );
};

export default TabNavigation;
