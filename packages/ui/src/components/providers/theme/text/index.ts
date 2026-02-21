import { MantineThemeOverride } from "@mantine/core";
import { lamoonMultiplier } from "../../../../fonts/lamoon";

const MantineText = {
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
} satisfies MantineThemeOverride;

export default MantineText;
