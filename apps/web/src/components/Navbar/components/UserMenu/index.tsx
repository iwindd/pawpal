"use client";
import {
  IconActivity,
  IconCoin,
  IconHistory,
  IconLogout,
  IconSettings,
} from "@pawpal/icons";
import { Session } from "@pawpal/shared";
import {
  Avatar,
  Box,
  Group,
  Menu,
  Space,
  Stack,
  Text,
  UnstyledButton,
} from "@pawpal/ui/core";
import clsx from "clsx";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import classes from "./style.module.css";

interface UserMenuProps {
  user: Session;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const __ = useTranslations("Navbar.userMenu");
  const format = useFormatter();

  return (
    <Menu
      width={300}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={clsx(
            classes.user,
            userMenuOpened ? classes.userActive : undefined
          )}
        >
          <Group justify="center">
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              radius="xl"
              size={40}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack gap={"sm"}>
          <Space />
          <Group>
            <Space />
            <Avatar
              src={user.avatar}
              alt={user.displayName}
              radius="xl"
              size={40}
            />
            <Box w={207} style={{ flex: 1 }}>
              <Text truncate="end" fw={500}>
                {user.displayName}
              </Text>
              <Text truncate="end" c="dimmed" size="xs">
                {user.email}
              </Text>
            </Box>
            <Space />
          </Group>
          <Menu.Item
            leftSection={<IconCoin size={16} stroke={1.5} />}
            rightSection={
              <Text c="blue" size="xs">
                {__("topup")}
              </Text>
            }
          >
            <Group gap={3}>
              <Text fw={500}>
                {format.number(user.coins, {
                  style: "currency",
                  currency: "THB",
                  currencyDisplay: "code",
                })}
              </Text>
            </Group>
          </Menu.Item>
        </Stack>
        <Menu.Divider />
        <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
          {__("accountSettings")}
        </Menu.Item>
        <Menu.Item leftSection={<IconHistory size={16} stroke={1.5} />}>
          {__("orders")}
        </Menu.Item>
        <Menu.Item leftSection={<IconActivity size={16} stroke={1.5} />}>
          {__("activities")}
        </Menu.Item>
        <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>
          {__("logout")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
