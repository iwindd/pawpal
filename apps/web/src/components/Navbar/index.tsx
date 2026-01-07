"use client";
import navbarLinks from "@/configs/navbar";
import { getPath } from "@/configs/route";
import { useAppSelector } from "@/hooks";
import { useActiveRouteConfig } from "@/hooks/useActiveRouteConfig";
import {
  Box,
  Burger,
  Container,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Stack,
} from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Link from "next/link";
import Logo from "../Logo";
import AuthSection from "./components/AuthSection";
import LocaleSwitcher from "./components/LocaleSwitcher";
import UserMenu from "./components/UserMenu";
import classes from "./style.module.css";

const ThemeSwitcher = dynamic(() => import("./components/ThemeSwitcher"), {
  ssr: false,
});

const Navbar = () => {
  const activeRoute = useActiveRouteConfig();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const user = useAppSelector((state) => state.auth.user);
  const __ = useTranslations("Routes");

  const items = navbarLinks.map((link) => {
    const path = getPath(link.name);
    return (
      <Link
        key={link.label}
        href={path}
        className={classes.link}
        data-active={activeRoute?.path === path ? "true" : undefined}
      >
        {__(link.label)}
      </Link>
    );
  });

  return (
    <Box className={classes.navbar}>
      <header className={classes.header}>
        <Container size="xl" className={classes.inner}>
          <Group h="100%" flex={1}>
            <Logo size={64} />
            <Group h={"100%"} flex={1} gap={5} visibleFrom="sm" ms={1}>
              {items}
            </Group>

            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
          <Group w="fit">
            <LocaleSwitcher />
            <ThemeSwitcher />
            <Divider orientation="vertical" />
            {user ? <UserMenu user={user} /> : <AuthSection />}
          </Group>
        </Container>
      </header>

      <Drawer.Root
        opened={drawerOpened}
        onClose={closeDrawer}
        hiddenFrom="sm"
        zIndex={1000000}
        padding="md"
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header py={"xs"}>
            <Stack>
              <Logo size={64} />
            </Stack>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <Divider my="xs" mt={0} />
            <ScrollArea h="calc(100vh - 80px" mx="-md">
              {items}
            </ScrollArea>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </Box>
  );
};

export default Navbar;
