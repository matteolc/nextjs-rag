export const workspaces = [
  {
    id: "workspace-1",
    name: "Workspace 1",
    description:
      "Workspace 1 description. This is a description for workspace 1.",
  },
  {
    id: "workspace-2",
    name: "Workspace 2",
    description:
      "Workspace 2 description. This is a description for workspace 2.",
  },
] as const;

export type Workspace = string;
export const WORKSPACES = workspaces.map((w) => w.id);
