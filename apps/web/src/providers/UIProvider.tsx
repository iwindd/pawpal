"use client";
import configTheme from "@/configs/theme";
import { Backdrop } from "@pawpal/ui/backdrop";
import {
  createTheme,
  localStorageColorSchemeManager,
  MantineProvider,
} from "@pawpal/ui/core";
import { Notifications } from "@pawpal/ui/notifications";

// Constants
const COLOR_SCHEME_KEY = "pawpal-color-scheme";
const DEFAULT_COLOR_SCHEME = "dark";

const colorSchemeManager = localStorageColorSchemeManager({
  key: COLOR_SCHEME_KEY,
});

interface UIProviderProps {
  children: React.ReactNode;
}

const UIProvider = ({ children }: UIProviderProps): React.JSX.Element => {
  const theme = createTheme({
    ...configTheme,
  });

  return (
    <MantineProvider
      theme={theme}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme={DEFAULT_COLOR_SCHEME}
    >
      <Notifications />
      <Backdrop />
      {children}
    </MantineProvider>
  );
};

export default UIProvider;
