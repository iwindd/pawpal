"use client";
import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import Logo from "../Logo";
import classes from "./styles.module.css";

interface NavbarLink {
  link: string;
  label: string;
}
interface NavbarProps {
  links: NavbarLink[];
  active: string;
}

const Navbar = ({ links, active }: Readonly<NavbarProps>) => {
  const [opened, { toggle }] = useDisclosure(false);
  const [activeLink, setActiveLink] = useState(active);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Logo />
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
};

export default Navbar;
