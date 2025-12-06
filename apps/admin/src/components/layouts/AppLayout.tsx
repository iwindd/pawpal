"use client";
import AppHeader from "@/components/layouts/AppHeader";
import { useAppSelector } from "@/hooks";
import { AppShell } from "@pawpal/ui/core";
import { useDisclosure, useMediaQuery } from "@pawpal/ui/hooks";
import { useEffect } from "react";
import Navbar from "./Navbar";
import classes from "./style.module.css";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [opened, { toggle }] = useDisclosure();
  const user = useAppSelector((state) => state.auth.user);

  const smallScreen = useMediaQuery("(max-width: --mantine-breakpoint-sm)");

  useEffect(() => {
    if (opened && smallScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [opened, smallScreen]);

  if (!user) return children;

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
