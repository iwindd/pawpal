"use client";
import { useAuth } from "@/contexts/AuthContext";
import { IconLogout, IconSettings } from "@pawpal/icons";
import { Session } from "@pawpal/shared";
import { backdrop } from "@pawpal/ui/backdrop";
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
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import classes from "./style.module.css";

interface UserMenuProps {
  user: Session;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { logout } = useAuth();
  const __ = useTranslations("Navbar.userMenu");
  const router = useRouter();

  const onLogout = async () => {
    try {
      backdrop.show({ text: "กำลังออกจากระบบ" });
      const state = await logout();
      if (!state) {
        return notify.show({
          title: __("notify.error.title"),
          message: __("notify.error.message"),
          color: "red",
        });
      }

      notify.show({
        title: __("notify.success.title"),
        message: __("notify.success.message"),
        color: "green",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      backdrop.hide();
    }
  };

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
          className={
            classes.user + (userMenuOpened ? ` ${classes.userActive}` : "")
          }
        >
          <Group justify="center">
            <Avatar alt={user.displayName} radius="xl" size={40} />
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
        </Stack>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconSettings size={16} stroke={1.5} />}
          component={Link}
          href="/user/"
        >
          {__("accountSettings")}
        </Menu.Item>
        <Menu.Item
          leftSection={<IconLogout size={16} stroke={1.5} />}
          onClick={onLogout}
        >
          {__("logout")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserMenu;
