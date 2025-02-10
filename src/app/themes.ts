import {
  ThemeVariantEnum,
  type MuiThemePreset,
  type StaticThemePreset,
} from "@palettebro/theme-generator";

export const themeColors = {
  blue: {
    primary: "#3498DB",
    secondary: "#9595D2",
    accent: "#E74C3C",
  },
  purple: {
    primary: "#8E44AD",
    secondary: "#74531C",
    accent: "#E67E22",
  },
  night: {
    primary: "#34495E",
    secondary: "#E74C3C",
    accent: "#ECF0F1",
  },
  herbal: {
    primary: "#16A085",
    secondary: "#2980B9",
    accent: "#D35400",
  },
};

export const themes = {
  light: {
    "color-scheme": "light" as const,
    variant: ThemeVariantEnum.dynamic,
    debug: true,
    baseColors: themeColors.blue,
  },
  dark: {
    "color-scheme": "dark" as const,
    variant: ThemeVariantEnum.dynamic,
    debug: true,
    baseColors: themeColors.blue,
  },
};
