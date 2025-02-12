import { Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Skeleton } from "@/ui/skeleton";

export const ChatLoading = () => {
	return (
		<div className="flex w-full gap-4 rounded-lg bg-muted p-4">
			<Avatar>
				<AvatarImage src="/avatars/02.png" />
				<AvatarFallback className="bg-primary text-primary-foreground">
					<Bot size={24} />
				</AvatarFallback>
			</Avatar>
			<div className="flex min-w-0 flex-1 flex-col space-y-3">
				<Skeleton className="h-4 w-[90%]" />
				<Skeleton className="h-4 w-[80%]" />
				<Skeleton className="h-4 w-[85%]" />
			</div>
		</div>
	);
};
