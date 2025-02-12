import { ChatPageWrapper } from "@/components/chat/chat-page-wrapper";
import { loader } from "@/loaders/chat-loader";

export default async function ChatPage() {
  const { tokenUsage } = await loader();

  return <ChatPageWrapper tokenUsage={tokenUsage?.[0]} />;
}
