import { DEFAULT_THEME, MantineThemeOverride } from "@mantine/core";
import { PawpalBlue, PawpalPink } from "./colors";

const MantineColors = {
  pawpink: PawpalPink,
  pawblue: PawpalBlue,
  danger: DEFAULT_THEME.colors.red,
  secondary: [
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
  warning: DEFAULT_THEME.colors.orange,
  success: DEFAULT_THEME.colors.teal,
} satisfies MantineThemeOverride["colors"];

export default MantineColors;
