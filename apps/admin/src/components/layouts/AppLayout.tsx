"use client";
import AppHeader from "@/components/layouts/AppHeader";
import { AppShell } from "@pawpal/ui/core";
import { useDisclosure, useMediaQuery } from "@pawpal/ui/hooks";
import { useEffect } from "react";
import Navbar from "./Navbar";
import classes from "./style.module.css";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [opened, { toggle }] = useDisclosure();

  const smallScreen = useMediaQuery("(max-width: --mantine-breakpoint-sm)");

  useEffect(() => {
    if (opened && smallScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [opened, smallScreen]);

  return (
    <AppShell
      padding="md"
      layout="alt"
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <AppHeader opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar opened={opened} toggle={toggle} />
      </AppShell.Navbar>
      <AppShell.Main className={classes.main}>{children}</AppShell.Main>
    </AppShell>
  );
}
