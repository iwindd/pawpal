"use client";
import navbarLinks from "@/configs/navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Burger, Container, Divider, Group } from "@pawpal/ui/core";
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
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <Group>
          <Logo size={64} />
          <Group gap={5} visibleFrom="xs" ms={1}>
            {items}
          </Group>

          <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        </Group>
        <Group>
          <LocaleSwitcher />
          <ThemeSwitcher />
          <Divider orientation="vertical" />
          {user ? <UserMenu user={user} /> : <AuthSection />}
        </Group>
      </Container>
    </header>
  );
};

export default Navbar;
