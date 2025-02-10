import { LayoutWrapper } from "@/components/layout-wrapper";
import { UserProvider } from "@/components/user-context";
import { WorkspaceProvider } from "@/components/workspace-context";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
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
	const workspace = cookieStore.get("workspace")?.value || "default";

	return (
		<UserProvider user={{ ...profile, email: user.email }}>
			<WorkspaceProvider workspace={workspace}>
				<LayoutWrapper>
					<div className="h-full flex-1 flex-col space-y-8 pt-8 px-8">
						{children}
					</div>
				</LayoutWrapper>
			</WorkspaceProvider>
		</UserProvider>
	);
}
