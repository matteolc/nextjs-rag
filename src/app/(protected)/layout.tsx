import { SidebarLayout } from "@/components/pages/sidebar-layout";
import { UserProvider } from "@/hooks/user-context";
import { WorkspaceProvider } from "@/hooks/workspace-context";
import { LocaleProvider } from "@/hooks/locale-context";
import { loader } from "@/loaders/protected-loader";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { locale, profile, workspace } = await loader();

	return (
		<LocaleProvider locale={locale}>
			<UserProvider user={{ ...profile, email: profile.email }}>
				<WorkspaceProvider workspace={workspace}>
					<SidebarLayout>
						<div className="h-full flex-1 flex-col space-y-8 pt-8 px-8">
							{children}
						</div>
					</SidebarLayout>
				</WorkspaceProvider>
			</UserProvider>
		</LocaleProvider>
	);
}
