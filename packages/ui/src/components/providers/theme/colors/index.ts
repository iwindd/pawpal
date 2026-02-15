import { DEFAULT_THEME, MantineThemeOverride } from "@mantine/core";

const MantineColors = {
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
  secondary: DEFAULT_THEME.colors.dark,
  success: DEFAULT_THEME.colors.teal,
} satisfies MantineThemeOverride["colors"];

export default MantineColors;
