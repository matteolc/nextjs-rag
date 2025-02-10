import { Sparkles } from "lucide-react";

import { formatTokens } from "@/lib/string";
import { MessageCircle } from "lucide-react";
import { Progress } from "@/ui/progress";

export function TokenUsage({
  usage,
}: {
  usage: {
    promptTokens: number | undefined;
    completionTokens: number | undefined;
    model: string | undefined;
  };
}) {
  const progress =
    usage.promptTokens && usage.completionTokens
      ? ((usage.promptTokens + usage.completionTokens) / 10e6) * 100
      : 0;

  if (!usage.promptTokens || !usage.completionTokens) {
    return null;
  }

  return (
    <div className="fixed top-4 right-14 z-50 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
      <div className="flex flex-col gap-2 min-w-[200px]">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">{usage.model}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-1 col-span-2 text-muted-foreground">
            <MessageCircle className="h-3 w-3" />
            <span>Prompt</span>
          </div>
          <div className="text-right font-medium text-foreground">
            {formatTokens(usage.promptTokens)}
          </div>

          <div className="flex items-center gap-1 col-span-2 text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Completion</span>
          </div>
          <div className="text-right font-medium text-foreground">
            {formatTokens(usage.completionTokens)}
          </div>
        </div>
      </div>
    </div>
  );
}
