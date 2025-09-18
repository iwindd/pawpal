"use client";
import configTheme from "@/configs/theme";
import {
  createTheme,
  localStorageColorSchemeManager,
  MantineProvider,
} from "@pawpal/ui/core";

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
      {children}
    </MantineProvider>
  );
};

export default UIProvider;
