"use client";

import type { Workspace } from "@/const/workspaces";
import { createContext, useContext } from "react";

export const WorkspaceContext = createContext<Workspace | null>(null);

export const WorkspaceProvider = ({
  children,
  workspace,
}: { children: React.ReactNode; workspace: Workspace }) => {
  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const workspace = useContext(WorkspaceContext);
  if (!workspace) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return workspace;
};
