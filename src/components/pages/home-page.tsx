import { Heading } from "@/ui/heading";
import type { Tables } from "@/app/db.types";
import { HeadingWrapper } from "@/ui/heading";
import { formatTokens } from "@/lib/string";
import { getServiceUsage } from "@/services/account-usage";
import { FileText, MessageSquareText } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";
import { Badge } from "@/ui/badge";
import { humanReadableMIMEType } from "@/lib/file";
import { Timestamp } from "../timestamp";

export function HomePage({
  profile,
  tokenUsage,
  recentFiles,
}: {
  profile: Tables<"profiles">;
  tokenUsage: Tables<"token_aggregation">[];
  recentFiles: Tables<"uploads">[];
}) {
  return (
    <div className="space-y-8">
      <HeadingWrapper className="flex items-center justify-between">
        <div>
          <Heading>Welcome back, {profile.first_name}</Heading>
          <p className="text-muted-foreground mt-1">
            Here's your daily overview
          </p>
        </div>
      </HeadingWrapper>

      {/* Updated Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Chat Usage */}
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-accent p-3">
              <MessageSquareText className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chat Usage</p>
              <p className="text-2xl font-semibold">
                {formatTokens(getServiceUsage("chat", tokenUsage).daily)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatTokens(getServiceUsage("chat", tokenUsage).total)} total
              </p>
            </div>
          </div>
        </div>

        {/* Summarization Usage */}
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-accent p-3">
              <Sparkles className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Summarization</p>
              <p className="text-2xl font-semibold">
                {formatTokens(
                  getServiceUsage("summarization", tokenUsage).daily,
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatTokens(
                  getServiceUsage("summarization", tokenUsage).total,
                )}{" "}
                total
              </p>
            </div>
          </div>
        </div>

        {/* Extraction Usage */}
        <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-accent p-3">
              <FileText className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Extraction</p>
              <p className="text-2xl font-semibold">
                {formatTokens(getServiceUsage("extraction", tokenUsage).daily)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatTokens(getServiceUsage("extraction", tokenUsage).total)}{" "}
                total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Files Section */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Files</h3>
          <Button variant="ghost" size="sm" className="text-primary" asChild>
            <Link href="/uploads" prefetch>
              View all
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          {recentFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Link
                  href={`/uploads/${file.id}`}
                  className="font-medium"
                  prefetch
                >
                  {file.name}
                </Link>
                <Badge
                  variant="outline"
                  className="text-sm text-muted-foreground"
                >
                  {humanReadableMIMEType(file.type)}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                <Timestamp timestamp={file.created_at} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
