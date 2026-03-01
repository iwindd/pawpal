"use client";
import { getPath, getRoute } from "@/configs/route";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { Tabs } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useCustomer } from "./CustomerContext";

const Tab = ({ routeName }: { routeName: string }) => {
  const route = getRoute(routeName);
  const { customer } = useCustomer();
  const __ = useTranslations("Routes");

  return (
    <Tabs.Tab
      value={route.name}
      component={Link}
      // @ts-ignore
      href={getPath(route.name, { id: customer.id })}
    >
      {__(route.label)}
    </Tabs.Tab>
  );
};

const TabNavigation = () => {
  const activeRoute = useActiveRouteConfig();

  const [tabs] = useState([
    getRoute("users.customers.edit"),
    getRoute("users.customers.histories"),
  ]);

  const [activeTabNested] = useState([
    [getRoute("users.customers.edit")],
    [
      getRoute("users.customers.histories"),
      getRoute("users.customers.histories.orders"),
      getRoute("users.customers.histories.topups"),
      getRoute("users.customers.histories.suspensions"),
    ],
  ]);

  const activeTab = activeTabNested.find((tab) =>
    tab.some((r) => r.name === activeRoute?.name),
  )?.[0]?.name!;

  return (
    <Tabs value={activeTab}>
      <Tabs.List>
        {tabs.map((tab) => (
          <Tab key={tab.name} routeName={tab.name} />
        ))}
      </Tabs.List>
    </Tabs>
  );
};

export default TabNavigation;
