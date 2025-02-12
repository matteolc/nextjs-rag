"use client";
import { PaletteProvider } from "@palettebro/theme-toolbar";
import { themes } from "../const/themes";
import { useTheme } from "next-themes";

export function ClientSideProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <div key={theme}>
      <PaletteProvider lightOrDark={theme} themes={themes}>
        {children}
      </PaletteProvider>
    </div>
  );
}
