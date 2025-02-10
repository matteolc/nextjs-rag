"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

export type UserWithProfile = Pick<User, "id" | "email"> & {
  first_name: string | null;
  last_name: string | null;
};

export const UserContext = createContext<UserWithProfile | null>(null);

export const UserProvider = ({
  children,
  user,
}: { children: React.ReactNode; user: UserWithProfile | null }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return user;
};
