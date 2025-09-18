"use client";
import { Burger, Container, Group } from "@pawpal/ui/core";
import { useDisclosure } from "@pawpal/ui/hooks";
import Link from "next/link";
import { useState } from "react";
import navbarLinks from "src/configs/navbar";
import Logo from "../Logo";
import classes from "./style.module.css";

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
      <Container size="md" className={classes.inner}>
        <Logo size={64} />
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
};

export default Navbar;
