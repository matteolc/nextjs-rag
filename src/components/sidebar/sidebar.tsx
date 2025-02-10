import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/ui/breadcrumb";
import { Separator } from "@/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Fragment } from "react";
import { sentenceCase } from "@/lib/string";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "../workspace-context";
import { workspaces } from "@/app/workspaces";

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const currentWorkspace = useWorkspace();
  const workspace = workspaces.find((ws) => ws.id === currentWorkspace);
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <Link
                    href="/"
                    className="transition-colors hover:text-foreground"
                  >
                    {workspace?.name}
                  </Link>
                </BreadcrumbItem>
                {pathSegments.length > 0 && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    {pathSegments.map((segment, index) => {
                      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                      const isLast = index === pathSegments.length - 1;
                      return (
                        <Fragment key={href}>
                          <BreadcrumbItem className="hidden md:block">
                            {isLast ? (
                              <BreadcrumbPage>
                                {sentenceCase(segment)}
                              </BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink asChild>
                                <Link
                                  href={href}
                                  className="transition-colors hover:text-foreground"
                                >
                                  {sentenceCase(segment)}
                                </Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!isLast && (
                            <BreadcrumbSeparator className="hidden md:block" />
                          )}
                        </Fragment>
                      );
                    })}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};
