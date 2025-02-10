import { useEffect, useRef, useState } from "react";
import type { Document } from "@langchain/core/documents";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Copy, Bot, Link2 } from "lucide-react";
import { Badge } from "@/ui/badge";

const ChatMessageServer = ({
  message,
  context,
}: {
  message: string | null;
  context?: Document[];
}) => {
  const [displayResponse, setDisplayResponse] = useState("");
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayResponse]);

  useEffect(() => {
    if (message === null) return;
    setDisplayResponse(message);
  }, [message]);

  return (
    <div className="flex w-full gap-4 rounded-lg bg-surface-container-lowest p-4">
      <Avatar>
        <AvatarImage src="/avatars/02.png" />
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot size={24} />
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col space-y-4">
        <div className="prose w-full break-words">
          <ReactMarkdown>{displayResponse}</ReactMarkdown>
        </div>

        {context && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              Context
            </div>
            <div className="grid gap-3">
              {context.map((doc) => {
                const fullPath = doc.metadata.source;
                const fileName = fullPath.split("/").pop() || "Document";
                const [name, extension] = fileName.split(/\.(?=[^.]+$)/);
                const cleanName = name
                  .replace(/_/g, " ")
                  .replace(/-/g, " ")
                  .replace(/\.(pdf|docx?|txt)$/i, "");

                return (
                  <div
                    key={fullPath}
                    className="group flex items-start gap-3 rounded-lg py-3 text-sm transition-colors hover:bg-accent/50"
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Link2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-medium text-foreground">
                          {cleanName}
                        </span>
                        {extension && (
                          <Badge className="text-xs">{extension}</Badge>
                        )}
                      </div>
                      <div className="mt-1 truncate font-mono text-xs text-muted-foreground">
                        {fullPath.split("/").slice(-2).join("/")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-border"
          >
            <Copy size={16} />
            Copy
          </Button>
        </div>
      </div>

      <div ref={bottomOfChatRef} />
    </div>
  );
};

export { ChatMessageServer };
