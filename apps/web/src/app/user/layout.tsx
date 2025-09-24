"use client";
import { IconActivity, IconHistory, IconSettings } from "@pawpal/icons";
import {
  Box,
  Container,
  Group,
  ScrollArea,
  Stack,
  UnstyledButton,
} from "@pawpal/ui/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import classes from "./style.module.css";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const pathname = usePathname();
  const __ = useTranslations("User");

  const navigationItems = [
    {
      label: __("account"),
      href: ["/user", "/user/profile"],
      icon: IconSettings,
    },
    {
      label: __("orders"),
      href: "/user/order",
      icon: IconHistory,
    },
    {
      label: __("activity"),
      href: "/user/activity",
      icon: IconActivity,
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Group align="flex-start" gap="xl">
        {/* Sidebar Navigation */}
        <Box
          w={{ base: "100%", md: 280 }}
          style={{ position: "sticky", top: 20 }}
          visibleFrom="md"
        >
          <Stack gap="xs">
            <ScrollArea>
              <Stack gap={4}>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = Array.isArray(item.href)
                    ? item.href.includes(pathname)
                    : pathname === item.href;

                  const key = Array.isArray(item.href)
                    ? item.href[0]
                    : item.href;
                  const href = Array.isArray(item.href)
                    ? item.href[0]
                    : item.href;

                  return (
                    <UnstyledButton
                      key={key}
                      component={Link}
                      href={href || "/"}
                      className={classes.link}
                      data-active={isActive || undefined}
                    >
                      <Icon size={16} stroke={1.5} />
                      {item.label}
                    </UnstyledButton>
                  );
                })}
              </Stack>
            </ScrollArea>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box style={{ flex: 1 }}>{children}</Box>
      </Group>
    </Container>
  );
};

export default UserLayout;
