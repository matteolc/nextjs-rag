import { createClient } from "@/utils/supabase/server";
import { workspaces } from "@/const/workspaces";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";

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

	const cookieStore = await cookies();
	const workspace = cookieStore.get("workspace")?.value || workspaces[0].id;

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
