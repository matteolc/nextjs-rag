"use client";
import { Sidebar } from "../sidebar/sidebar";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}
