"use client";

import { SidebarMenuItem } from "@/ui/sidebar";
import { SidebarMenuButton } from "@/ui/sidebar";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const SidebarThemeSwitcher = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const THEME_ICON = {
		light: <Sun size={16} />,
		dark: <Moon size={16} />,
		system: <Laptop size={16} />,
	};

	if (!theme) {
		return null;
	}

	return (
		<SidebarMenuItem key={theme}>
			<SidebarMenuButton asChild size="sm">
				<button
					type="button"
					onClick={() => {
						setTheme(theme === "light" ? "dark" : "light");
					}}
				>
					{THEME_ICON[theme as keyof typeof THEME_ICON]}
					{theme.charAt(0).toUpperCase() + theme?.slice(1)}
				</button>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

const ThemeSwitcher = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const themes = ["light", "dark", "system"];

	return (
		<div className="flex gap-1">
			{themes.map((t) => (
				<button
					type="button"
					key={t}
					className="rounded-full hover:bg-muted"
					onClick={() => setTheme(t)}
				>
					{t === "light" ? (
						<Sun size={16} className="text-muted-foreground" />
					) : t === "dark" ? (
						<Moon size={16} className="text-muted-foreground" />
					) : (
						<Laptop size={16} className="text-muted-foreground" />
					)}
					<span className="sr-only">
						{t.charAt(0).toUpperCase() + t.slice(1)}
					</span>
				</button>
			))}
		</div>
	);
};

export { ThemeSwitcher };
