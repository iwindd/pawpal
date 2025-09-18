"use client";
import { mantineHtmlProps, MantineProvider } from "@mantine/core";
import Theme from "../configs/theme";

export const uiProps = mantineHtmlProps;

function UIProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <MantineProvider theme={Theme}>{children}</MantineProvider>;
}

export default UIProvider;
