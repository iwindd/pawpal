"use client";
import {
  createTheme,
  mantineHtmlProps,
  MantineProvider,
  MantineThemeOverride,
} from "@mantine/core";

export const uiProps = mantineHtmlProps;
export type UIThemeOverride = MantineThemeOverride;

function UIProvider({
  children,
  themeOverride,
}: Readonly<{
  children: React.ReactNode;
  themeOverride: UIThemeOverride;
}>) {
  const Theme: ReturnType<typeof createTheme> = createTheme({
    ...themeOverride,
  });

  return <MantineProvider theme={Theme}>{children}</MantineProvider>;
}

export default UIProvider;
