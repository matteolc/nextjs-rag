"use client";
import { Sidebar } from "./sidebar/sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}
