import { ChatPageWrapper } from "@/components/chat/chat-page-wrapper";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return redirect("/sign-in");
  }

  const { data: tokenUsage } = await supabase
    .from("token_aggregation")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("namespace", "default")
    .eq("service", "chat")
    .eq("time_bucket", new Date().toISOString().split("T")[0])
    .order("time_bucket", { ascending: false })
    .limit(1);

  return <ChatPageWrapper tokenUsage={tokenUsage?.[0]} />;
}
