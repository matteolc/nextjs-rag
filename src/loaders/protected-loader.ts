import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { getWorkspace } from "@/lib/workspace";

export const loader = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return redirect("/sign-in");
  }

  const workspace = await getWorkspace();

  const headers = { "accept-language": "en-US,en;q=0.5" };
  const languages = new Negotiator({ headers }).languages();
  const locales = ["en-US", "it-IT", "it", "en"];
  const defaultLocale = "en-US";

  return {
    locale: match(languages, locales, defaultLocale),
    workspace,
    profile: {
      ...profile,
      email: user.email,
    },
  };
};
