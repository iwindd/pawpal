"use client";
import navbarLinks from "@/configs/navbar";
import { Burger, Container, Group } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import Logo from "../Logo";
import LocaleSwitcher from "./components/LocaleSwitcher";
import UserMenu from "./components/UserMenu";
import classes from "./style.module.css";

const ThemeSwitcher = dynamic(() => import("./components/ThemeSwitcher"), {
  ssr: false,
});

const Navbar = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [activeLink, setActiveLink] = useState("/");

  const items = navbarLinks.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={activeLink === link.link || undefined}
    >
      {link.label}
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
          <UserMenu />
        </Group>
      </Container>
    </header>
  );
};

export default Navbar;
