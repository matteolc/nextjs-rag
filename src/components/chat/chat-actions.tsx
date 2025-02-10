import { SparklesIcon, SendIcon } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/ui/button";

const ChatActions = ({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <div className="flex w-full items-center justify-between rounded-b-xl bg-background p-2 shadow-[0_8px_12px_-2px_rgba(19,21,22,0.04),0_4px_8px_rgba(19,21,22,0.02)]">
      <div className="ml-auto mr-2 flex items-center justify-center">
        <Button
          aria-label="Improve"
          disabled={!enabled}
          variant="ghost"
          className="group mr-2 text-muted-foreground"
        >
          <SparklesIcon />
          Improve
        </Button>
        <button
          type="button"
          aria-label="Ask"
          disabled={!enabled}
          onClick={onClick}
          className={clsx(
            "group rounded-full p-1.5",
            enabled ? "hover:bg-primary" : "opacity-60",
          )}
        >
          <SendIcon
            className={clsx(
              "h-5 w-5 -ml-0.5 fill-primary",
              enabled ? "text-primary" : "text-primary opacity-60",
            )}
          />
        </button>
      </div>
    </div>
  );
};
export { ChatActions };
