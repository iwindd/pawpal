import Logo from "@/components/Logo";
import { NavbarFolder, NavbarItem, navlinks } from "@/configs/navbar";
import { getRoute } from "@/configs/route";
import { useGetNotificationsQuery } from "@/features/notification/notificationApi";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import { IconChevronDown, IconChevronRight } from "@pawpal/icons";
import {
  Anchor,
  Badge,
  Burger,
  Collapse,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import classes from "./style.module.css";

interface Props {
  opened: boolean;
  toggle: () => void;
}

export default function Navbar({ opened, toggle }: Readonly<Props>) {
  return (
    <Stack h="100%" gap={0}>
      {/* Header */}
      <Group gap={8} w="100%" align="center" px="md" pt="md" pb="xs">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Anchor component={Link} href={getRoute("home").path}>
          <Logo />
        </Anchor>
      </Group>

      {/* Main Navbar */}
      <ScrollArea h="100%">
        <Flex h="100%" direction="column" align="start" gap={5}>
          {navlinks.map((navlink) => {
            if (navlink instanceof NavbarFolder) {
              return <Folder key={navlink.name} {...navlink} />;
            }

            if (navlink instanceof NavbarItem) {
              return <LinkItem key={navlink.route.name} {...navlink} />;
            }

            return null;
          })}
        </Flex>
      </ScrollArea>
    </Stack>
  );
}

const LinkItem = ({ icon: Icon, route, notification: notiKey }: NavbarItem) => {
  const __ = useTranslations("Navbar.items");
  const activeRoute = useActiveRouteConfig();
  const [notificationCount, setNotificationCount] = useState(0);

  const { data: notifications } = useGetNotificationsQuery();
  const isActive = activeRoute?.name === route.name;
  const format = useFormatter();

  useEffect(() => {
    if (notifications && notiKey !== undefined) {
      setNotificationCount(notifications[notiKey] ?? 0);
    }
  }, [notifications, notiKey]);

  return (
    <Stack px="md" w="100%">
      <Link
        data-active={isActive}
        className={classes.navbarItem}
        href={route.path}
      >
        {Icon && <Icon size={20} />}
        <Text className={classes.title} lts={-0.5}>
          {__(route.name)}
        </Text>
        {notificationCount > 0 && notiKey !== undefined && (
          <Badge variant="light" ml="auto" size="sm">
            {format.number(notificationCount)}
          </Badge>
        )}
      </Link>
    </Stack>
  );
};

const Folder = ({ name, items }: NavbarFolder) => {
  const [opened, { toggle }] = useDisclosure(true);
  const __ = useTranslations("Navbar");

  return (
    <Flex direction="column" align="start" w="100%">
      {/* TRIGGER */}
      <UnstyledButton
        h={36.15}
        className={classes.folder}
        onClick={toggle}
        px={"xs"}
      >
        <Flex align="center" gap={1}>
          {opened ? (
            <IconChevronDown size={14} className={classes.expandLess} />
          ) : (
            <IconChevronRight size={14} className={classes.expandMore} />
          )}
          <Text className={classes.title} lts={-0.5}>
            {__(`groups.${name}`)}
          </Text>
        </Flex>
      </UnstyledButton>
      {/* CONTENT */}
      <Collapse w="100%" in={opened}>
        <Flex w="100%" direction="column" align="start" gap={5}>
          {items.map((item) => {
            return <LinkItem key={item.route.name} {...item} />;
          })}
        </Flex>
      </Collapse>
    </Flex>
  );
};
