import { workspaces } from "@/const/workspaces";
import { cookies } from "next/headers";

export const DEFAULT_WORKSPACE = workspaces[0].id;

export const getWorkspace = async () => {
  const cookieStore = await cookies();
  const workspace = cookieStore.get("workspace")?.value || DEFAULT_WORKSPACE;
  return workspace;
};

export const setWorkspace = async (workspace: string) => {
  const cookieStore = await cookies();
  cookieStore.set("workspace", workspace, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};
