import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 flex-col">
        <div className="w-full max-w-sm">{children}</div>
        <div className="mt-4 grid justify-center text-center text-sm text-muted-foreground">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
