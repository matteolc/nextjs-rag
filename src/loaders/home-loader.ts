import { createClient } from "@/utils/supabase/server";
import { getWorkspace } from "@/lib/workspace";

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

  const workspace = await getWorkspace();

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
