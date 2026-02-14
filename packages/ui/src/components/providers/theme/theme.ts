"use client";
import { DEFAULT_THEME, MantineThemeOverride } from "@pawpal/ui/core";
import MantineBreakpoints from "./breakpoints";
import MantineColors from "./colors";
import { components } from "./components";
import MantineText from "./text";

const configTheme: MantineThemeOverride = {
  primaryShade: { light: 6, dark: 8 },
  primaryColor: "pawpink",

  ...MantineText,
  colors: MantineColors,
  breakpoints: MantineBreakpoints,
  components,

  spacing: {
    ...DEFAULT_THEME.spacing,
    "2xl": "calc(2.5rem * var(--mantine-scale))",
    "3xl": "calc(3rem * var(--mantine-scale))",
  },
};

export default configTheme;
