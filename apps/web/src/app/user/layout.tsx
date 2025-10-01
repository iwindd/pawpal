"use client";
import { RouteItem, ROUTES } from "@/configs/route";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveRouteTrail } from "@/hooks/useActiveRouteTrail";
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
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import classes from "./style.module.css";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const __ = useTranslations("Routes");
  const { user } = useAuth();
  const router = useRouter();
  const trail = useActiveRouteTrail();
  const navigationItems = [
    ROUTES.user as RouteItem,
    ROUTES.user?.children?.profile as RouteItem,
    ROUTES.user?.children?.order as RouteItem,
    ROUTES.user?.children?.activity as RouteItem,
  ];
  const activeRoute = trail.at(-1);

  if (!user) {
    router.push(ROUTES.home?.path as string);
    return null;
  }

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
                {navigationItems.map((item: RouteItem) => {
                  const Icon = item.icon;
                  const path =
                    typeof item.path === "string" ? item.path : item.path();
                  const isActive = activeRoute?.path === path;

                  return (
                    <UnstyledButton
                      key={path}
                      component={Link}
                      href={path || "/"}
                      className={classes.link}
                      data-active={isActive || undefined}
                    >
                      {Icon && <Icon size={16} stroke={1.5} />}
                      {__(item.label)}
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
