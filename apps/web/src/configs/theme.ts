"use client";
import {
  Container,
  DEFAULT_THEME,
  MantineThemeOverride,
  rem,
} from "@pawpal/ui/core";
import postcssConfig from "@pawpal/ui/postcss.config";
import { lamoonMultiplier } from "./fonts/lamoon";
import CONTAINER_SIZES, { ContainerSizeKey } from "./theme/container";

const postcssConfigBreakpoints =
  postcssConfig.plugins["postcss-simple-vars"].variables;

/**
 * Calculates the appropriate container size based on fluid mode and size parameter
 * @param fluid - Whether the container should be fluid (100% width)
 * @param size - The container size key or custom size value
 * @returns The calculated container size as a CSS value
 */
const calculateContainerSize = (fluid?: boolean, size?: unknown): string => {
  if (fluid) {
    return "100%";
  }

  if (
    size !== undefined &&
    typeof size === "string" &&
    size in CONTAINER_SIZES
  ) {
    return rem(CONTAINER_SIZES[size as ContainerSizeKey]);
  }

  if (typeof size === "number") {
    return rem(size);
  }

  return "100%";
};

const configTheme: MantineThemeOverride = {
  /** Controls focus ring styles. Supports the following options: `auto`, `always`, `never` */
  focusRing: "auto",

  /** Determines whether `font-smoothing` property should be set on the body */
  fontSmoothing: true,

  /** font-family used in all components, system fonts by default */
  fontFamily: "Lamoon, sans-serif",

  /** Controls various styles of h1-h6 elements, used in Typography and Title components */
  headings: {
    fontFamily: "Sarabun, sans-serif",
  },

  /** font-family used in all components, system fonts by default */
  fontSizes: {
    xs: `${0.75 * lamoonMultiplier}rem`,
    sm: `${0.875 * lamoonMultiplier}rem`,
    md: `${1 * lamoonMultiplier}rem`,
    lg: `${1.125 * lamoonMultiplier}rem`,
    xl: `${1.25 * lamoonMultiplier}rem`,
  },

  // Object of values that are used to control breakpoints in all components
  breakpoints: {
    xs: postcssConfigBreakpoints["mantine-breakpoint-xs"],
    sm: postcssConfigBreakpoints["mantine-breakpoint-sm"],
    md: postcssConfigBreakpoints["mantine-breakpoint-md"],
    lg: postcssConfigBreakpoints["mantine-breakpoint-lg"],
    xl: postcssConfigBreakpoints["mantine-breakpoint-xl"],
  },

  /** Object of colors, key is color name, value is an array of at least 10 strings (colors) */
  colors: {
    pawpink: [
      "#ffecf7",
      "#f7d9e8",
      "#efc2d9",
      "#de85b2",
      "#d3619b",
      "#cd4a8d",
      "#cb3d85",
      "#b42f73",
      "#a12766",
      "#8e1c59",
    ],
    pawblue: [
      "#ebf3ff",
      "#dbe4f7",
      "#b7c5e5",
      "#90a5d4",
      "#7e96cb",
      "#5a79bd",
      "#4f70ba",
      "#3f5fa4",
      "#355594",
      "#284985",
    ],
    danger: DEFAULT_THEME.colors.red,
  },

  /** Index of theme.colors[color].
   *  Primary shade is used in all components to determine which color from theme.colors[color] should be used.
   *  Can be either a number (0–9) or an object to specify different color shades for light and dark color schemes.
   *  Default value `{ light: 6, dark: 8 }`
   * */
  primaryShade: { light: 6, dark: 8 },

  /** Key of `theme.colors`, hex/rgb/hsl values are not supported.
   *  Determines which color will be used in all components by default.
   *  Default value – `blue`.
   * */
  primaryColor: "pawpink",

  components: {
    Modal: {
      defaultProps: {
        overlayProps: {
          backgroundOpacity: 0.55,
          blur: 6,
        },
      },
    },
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          "--container-size": calculateContainerSize(fluid, size),
        },
      }),
      defaultProps: {
        size: "xl",
      },
    }),
  },
};

export default configTheme;
