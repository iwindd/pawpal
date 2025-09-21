"use client";
import navbarLinks from "@/configs/navbar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Burger,
  Container,
  Divider,
  Drawer,
  Group,
  ScrollArea,
} from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import Logo from "../Logo";
import AuthSection from "./components/AuthSection";
import LocaleSwitcher from "./components/LocaleSwitcher";
import UserMenu from "./components/UserMenu";
import classes from "./style.module.css";

const ThemeSwitcher = dynamic(() => import("./components/ThemeSwitcher"), {
  ssr: false,
});

const Navbar = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [activeLink, setActiveLink] = useState("/");
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { user } = useAuth();
  const __ = useTranslations("Navbar.links");

  const items = navbarLinks.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={activeLink === link.link || undefined}
    >
      {__(link.label)}
    </Link>
  ));

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
              opened={opened}
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

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        padding="md"
        title={<Logo size={64} />}
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="md" />
          {items}
        </ScrollArea>
      </Drawer>
    </Box>
  );
};

export default Navbar;
