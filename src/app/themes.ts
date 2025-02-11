import { ThemeVariantEnum } from "@palettebro/theme-generator";

export const themeColors = {
	blue: {
		primary: "#3498DB",
	},
	purple: {
		primary: "#8E44AD",
	},
	night: {
		primary: "#34495E",
	},
	herbal: {
		primary: "#16A085",
	},
};

export const themes = {
	light: {
		"color-scheme": "light" as const,
		variant: ThemeVariantEnum.mui,
		debug: false,
		baseColors: themeColors.blue,
	},
	dark: {
		"color-scheme": "dark" as const,
		variant: ThemeVariantEnum.mui,
		debug: false,
		baseColors: themeColors.blue,
	},
};
