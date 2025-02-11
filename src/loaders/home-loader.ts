import { createClient } from "@/utils/supabase/server";
import { workspaces } from "@/const/workspaces";
import { cookies } from "next/headers";

export const loader = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profile: null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return {
      profile: null,
    };
  }

  const cookieStore = await cookies();
  const workspace = cookieStore.get("workspace")?.value || workspaces[0].id;

  const { data: tokenUsage } = await supabase
    .from("token_aggregation")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("namespace", workspace)
    .order("time_bucket", { ascending: false })
    .limit(30);

  const { data: recentFiles } = await supabase
    .from("uploads")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("namespace", workspace)
    .order("created_at", { ascending: false })
    .limit(3);

  return {
    profile,
    tokenUsage: tokenUsage || [],
    recentFiles: recentFiles || [],
  };
};
