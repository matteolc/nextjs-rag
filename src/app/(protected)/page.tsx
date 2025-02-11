import { HomePage } from "@/components/pages/home-page";
import { loader } from "@/loaders/home-loader";
import type { Tables } from "../db.types";

export default async function Page() {
	const { profile, tokenUsage, recentFiles } = await loader();
	return (
		<HomePage
			profile={profile as Tables<"profiles">}
			tokenUsage={tokenUsage || []}
			recentFiles={recentFiles || []}
		/>
	);
}
