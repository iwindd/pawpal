"use client";
import { MantineThemeOverride } from "@pawpal/ui/core";

const configTheme: MantineThemeOverride = {
  /** Controls focus ring styles. Supports the following options: `auto`, `always`, `never` */
  focusRing: "auto",

  /** Determines whether `font-smoothing` property should be set on the body */
  fontSmoothing: true,

  /** font-family used in all components, system fonts by default */
  fontFamily: "Sarabun, sans-serif",
};

export default configTheme;
