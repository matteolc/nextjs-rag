import { Avatar, AvatarImage, AvatarFallback } from "@/ui/avatar";
import { User } from "lucide-react";

const ChatMessageUser = ({ message }: { message: string }) => {
  return (
    <div
      className="w-full rounded-xl bg-surface-container-lowest text-muted-foreground"
      dir="auto"
      data-scroll-anchor="false"
    >
      <div className="m-auto text-base">
        <div className="mx-auto flex flex-1 text-base">
          <div className="relative flex w-full min-w-0 flex-col">
            <div className="flex-col">
              <div className="flex max-w-full flex-grow flex-col">
                <div
                  dir="auto"
                  className="flex min-h-[20px] w-full flex-col items-end gap-2 overflow-x-auto whitespace-pre-wrap break-words"
                >
                  <div className="flex w-full flex-col items-end gap-1 empty:hidden rtl:items-start">
                    <div className="relative items-center flex max-w-[70%] flex-row gap-4 px-5 py-2.5">
                      <p>{message}</p>
                      <Avatar>
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>
                          <User size={16} />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ChatMessageUser };
