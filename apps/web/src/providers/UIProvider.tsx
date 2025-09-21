"use client";
import configTheme from "@/configs/theme";
import { Backdrop } from "@pawpal/ui/backdrop";
import {
  createTheme,
  localStorageColorSchemeManager,
  MantineProvider,
} from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";

const colorSchemeManager = localStorageColorSchemeManager({
  key: "pawpal-color-scheme",
});

const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = createTheme({
    ...configTheme,
  });

  return (
    <MantineProvider
      theme={theme}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="dark"
    >
      <Notifications />
      <Backdrop />
      {children}
    </MantineProvider>
  );
};

export default UIProvider;
