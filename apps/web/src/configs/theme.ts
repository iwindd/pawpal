"use client";
import { MantineThemeOverride } from "@pawpal/ui/core";

const configTheme: MantineThemeOverride = {
  /** Controls focus ring styles. Supports the following options: `auto`, `always`, `never` */
  focusRing: "auto",

  /** Determines whether `font-smoothing` property should be set on the body */
  fontSmoothing: true,

  /** font-family used in all components, system fonts by default */
  fontFamily: "Sarabun, sans-serif",

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
  primaryColor: "pink",
};

export default configTheme;
