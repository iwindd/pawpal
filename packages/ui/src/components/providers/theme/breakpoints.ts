import postcssConfig from "@pawpal/ui/postcss.config";
import { MantineThemeOverride } from "core";

const postcssConfigBreakpoints =
  postcssConfig.plugins["postcss-simple-vars"].variables;

const MantineBreakpoints = {
  xs: postcssConfigBreakpoints["mantine-breakpoint-xs"],
  sm: postcssConfigBreakpoints["mantine-breakpoint-sm"],
  md: postcssConfigBreakpoints["mantine-breakpoint-md"],
  lg: postcssConfigBreakpoints["mantine-breakpoint-lg"],
  xl: postcssConfigBreakpoints["mantine-breakpoint-xl"],
} satisfies MantineThemeOverride["breakpoints"];

export default MantineBreakpoints;
