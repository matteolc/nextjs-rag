"use server";

import { cookies } from "next/headers";

export const switchWorkspaceAction = async (workspace: string) => {
  const cookieStore = await cookies();
  cookieStore.set("workspace", workspace, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};
