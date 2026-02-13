"use client";
import { MantineThemeOverride } from "@pawpal/ui/core";
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
};

export default configTheme;
