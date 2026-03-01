"use client";
import { getPath, getRoute } from "@/configs/route";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { Tabs } from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useEmployee } from "./EmployeeContext";

const Tab = ({ routeName }: { routeName: string }) => {
  const route = getRoute(routeName);
  const { employee } = useEmployee();
  const __ = useTranslations("Routes");

  return (
    <Tabs.Tab
      value={route.name}
      component={Link}
      // @ts-ignore
      href={getPath(route.name, { id: employee.id })}
    >
      {__(route.label)}
    </Tabs.Tab>
  );
};

const TabNavigation = () => {
  const activeRoute = useActiveRouteConfig();

  const [tabs] = useState([
    getRoute("users.employees.edit"),
    getRoute("users.employees.histories"),
  ]);

  const [activeTabNested] = useState([
    [getRoute("users.employees.edit")],
    [
      getRoute("users.employees.histories"),
      getRoute("users.employees.histories.orders"),
      getRoute("users.employees.histories.topups"),
      getRoute("users.employees.histories.suspensions"),
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
