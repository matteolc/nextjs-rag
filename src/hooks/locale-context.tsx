"use client";
import { createContext, useContext } from "react";

const defaultLocale = "en";

export const LocaleContext = createContext<string>("en");

export const LocaleProvider = ({
	children,
	locale,
}: { children: React.ReactNode; locale: string | undefined }) => {
	return (
		<LocaleContext.Provider value={locale || defaultLocale}>
			{children}
		</LocaleContext.Provider>
	);
};

export const useLocale = () => {
	const locale = useContext(LocaleContext);
	return locale;
};
