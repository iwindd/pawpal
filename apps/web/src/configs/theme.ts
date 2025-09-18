"use client";
import { UIThemeOverride } from "@pawpal/ui/providers/UIProvider";

const configTheme: UIThemeOverride = {
  /** Controls focus ring styles. Supports the following options:
   *  - `auto` – focus ring is displayed only when the user navigates with keyboard (default value)
   *  - `always` – focus ring is displayed when the user navigates with keyboard and mouse
   *  - `never` – focus ring is always hidden (not recommended)
   */
  focusRing: "auto",

  /** Determines whether `font-smoothing` property should be set on the body, `true` by default */
  fontSmoothing: true,

  /** font-family used in all components, system fonts by default */
  fontFamily: "Sarabun, sans-serif",
};

export default configTheme;
