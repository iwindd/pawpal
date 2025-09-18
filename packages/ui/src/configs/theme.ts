"use client";
import { type MantineThemeOverride, createTheme } from "@mantine/core";

const themeOverride: MantineThemeOverride = {};

export const Theme: ReturnType<typeof createTheme> = createTheme(themeOverride);

export default Theme;
