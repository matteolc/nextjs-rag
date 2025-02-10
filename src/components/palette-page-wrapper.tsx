"use client";

import { ThemePalette, ThemeUtilitiesDisplay } from "@palettebro/theme-toolbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

export function PalettePageWrapper({
  children,
}: { children?: React.ReactNode }) {
  return (
    <Tabs defaultValue="palette" className="space-y-4">
      <TabsList className="h-8">
        <TabsTrigger value="palette" className="text-xs px-2 py-1">
          Palette
        </TabsTrigger>
        <TabsTrigger value="utilities" className="text-xs px-2 py-1">
          Utilities
        </TabsTrigger>
      </TabsList>
      <TabsContent value="palette">
        <ThemePalette />
      </TabsContent>
      <TabsContent value="utilities">
        <ThemeUtilitiesDisplay />
      </TabsContent>
    </Tabs>
  );
}
