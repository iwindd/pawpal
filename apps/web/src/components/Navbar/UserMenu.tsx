"use client";
import {
  IconActivity,
  IconCoin,
  IconHistory,
  IconLogout,
  IconSettings,
} from "@pawpal/icons";
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
import { useState } from "react";
import classes from "./style.module.css";

const USER_MOCKUP = {
  name: "Achirawit Kaewkhong",
  email: "achiarwitkaewkhong@outlook.com",
  image:
    "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png",
};

const UserMenu = () => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);

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
            <Space />
            <Avatar
              src={USER_MOCKUP.image}
              alt={USER_MOCKUP.name}
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
              src={USER_MOCKUP.image}
              alt={USER_MOCKUP.name}
              radius="xl"
              size={40}
            />
            <Box w={207} style={{ flex: 1 }}>
              <Text truncate="end" fw={500}>
                {USER_MOCKUP.name}
              </Text>
              <Text truncate="end" c="dimmed" size="xs">
                {USER_MOCKUP.email}
              </Text>
            </Box>
            <Space />
          </Group>
          <Menu.Item
            leftSection={<IconCoin size={16} stroke={1.5} />}
            rightSection={
              <Text c="blue" size="xs">
                เติมเงิน
              </Text>
            }
          >
            <Group gap={3}>
              <Text fw={500}>0.00</Text>
              <Text>Coins</Text>
            </Group>
          </Menu.Item>
        </Stack>
        <Menu.Divider />
        <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
          Account settings
        </Menu.Item>
        <Menu.Item leftSection={<IconHistory size={16} stroke={1.5} />}>
          Orders
        </Menu.Item>
        <Menu.Item leftSection={<IconActivity size={16} stroke={1.5} />}>
          Activities
        </Menu.Item>
        <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
