"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChatActions } from "./chat-actions";
import { ChatEmpty } from "./chat-empty";
import { ChatLoading } from "./chat-loading";
import { ChatMessageServer } from "./chat-message-server";
import { ChatMessageUser } from "./chat-message-user";
import { type Message, MessageRole } from "./types";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/ui/button";
import { TokenUsage } from "./token-usage";
import Contenteditable from "./content-editable";
import type { Tables } from "@/app/db.types";
import { useWorkspace } from "../../hooks/workspace-context";
import { useUser } from "@/hooks/user-context";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ScrollArea } from "@/ui/scroll-area";

export function ChatPageWrapper({
  tokenUsage,
}: { tokenUsage: Tables<"token_aggregation"> | undefined }) {
  const supabase = createClient();
  const profile = useUser();
  const [usage, setUsage] = useState({
    promptTokens: tokenUsage?.total_prompt_tokens,
    completionTokens: tokenUsage?.total_completion_tokens,
    model: tokenUsage?.model,
  });
  const workspace = useWorkspace();
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const EMPTY_MESSAGE_STATE = {
    messages: [],
    history: [],
  };
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    pending?: string;
    history: [string, string][];
    pendingSourceDocs?: Document[];
  }>(EMPTY_MESSAGE_STATE);

  const { messages, pending, history } = messageState;
  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(pending ? [{ type: MessageRole.system, message: pending }] : []),
    ];
  }, [messages, pending]);

  const form = new FormData();
  form.set("workspace", workspace);
  form.set("profile_id", profile.id);
  form.set("service", "chat");

  const sendFormAction = async (form: FormData) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: form,
    });
    const data = await response.json();
    const { answer: message, question, context } = data;
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: MessageRole.system,
          message,
          context,
        },
      ],
      history: [...state.history, [question, message]],
    }));
    setIsLoading(false);
  };

  const sendFormActionWithStreaming = async (form: FormData) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      body: form,
      cache: "no-cache",
    });
    setIsLoading(false);
    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();
    if (!reader) return;
    setMessageState((state) => ({
      ...state,
      messages: [...state.messages, { type: MessageRole.system, message: "" }],
    }));
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setMessageState((prev) => {
        const lastIndex = prev.messages.length - 1;
        const updatedMessages = [...prev.messages];
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          message: updatedMessages[lastIndex].message + value,
        };
        return { ...prev, messages: updatedMessages };
      });
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleSubmit = useCallback(
    (
      e:
        | React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>
        | React.MouseEvent<HTMLButtonElement>,
    ) => {
      e.preventDefault();
      const question = query.trim();

      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: MessageRole.user,
            message: question,
          },
        ],
        pending: undefined,
      }));

      setQuery("");
      setMessageState((state) => ({ ...state, pending: "" }));
      setIsLoading(true);
      form.set("question", question);
      form.set("history", JSON.stringify(history));
      sendFormActionWithStreaming(form);
    },
    [query, history],
  );

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
      if (e.key === "Enter") {
        handleSubmit(e);
      } else if (e.key === "Enter") {
        e.preventDefault();
      }
    },
    [handleSubmit],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const channel = supabase
      .channel("usage-insert-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "token_aggregation",
          filter: `profile_id=eq.${profile.id}`,
        },
        (payload) => {
          if (
            payload.new.namespace === workspace &&
            payload.new.service === "chat"
          ) {
            setUsage({
              promptTokens: payload.new.total_prompt_tokens,
              completionTokens: payload.new.total_completion_tokens,
              model: payload.new.model,
            });
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "token_aggregation",
          filter: `profile_id=eq.${profile.id}`,
        },
        (payload) => {
          if (
            payload.new.namespace === workspace &&
            payload.new.service === "chat"
          ) {
            setUsage({
              promptTokens: payload.new.total_prompt_tokens,
              completionTokens: payload.new.total_completion_tokens,
              model: payload.new.model,
            });
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [profile.id]);

  return (
    <div className="flex flex-col h-full">
      <TokenUsage usage={usage} key={usage.toString()} />
      <div className="hidden h-full flex-1 flex-col space-y-4 md:flex">
        {chatMessages.length > 0 && (
          <div className="flex w-full items-center justify-between pb-6">
            <Button
              color="secondary"
              onClick={() => setMessageState(EMPTY_MESSAGE_STATE)}
            >
              Clear Chat
            </Button>
          </div>
        )}
        {chatMessages.length === 0 && (
          <div className="flex justify-center">
            <ChatEmpty setCurrentTask={setQuery} />
          </div>
        )}

        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="flex flex-col gap-y-6">
              {chatMessages.map(({ message, context, type }, index) => (
                <div key={`${type}-${message.substring(0, 20)}-${index}`}>
                  {type === MessageRole.user ? (
                    <ChatMessageUser message={message} />
                  ) : (
                    <ScrollArea>
                      <ChatMessageServer message={message} context={context} />
                    </ScrollArea>
                  )}
                </div>
              ))}
              {isLoading && <ChatLoading />}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0">
          <div className="flex w-full flex-col items-center rounded-xl border border-border">
            <div className="flex w-full flex-col gap-2 rounded-t-xl bg-background p-2 pt-3">
              <div className="ml-6 relative h-full w-full">
                <div className="flex min-h-[30px] w-full flex-1 cursor-text resize-none overflow-y-auto border-none text-left placeholder-primary shadow-none focus:outline-none focus:ring-0 focus:ring-transparent">
                  <Contenteditable
                    value={query}
                    onChange={setQuery}
                    onKeyDown={handleEnter}
                    className="word-break focus:expand no-scrollbar m-0 w-full resize-none whitespace-break-spaces border-0 border-transparent bg-transparent px-0 text-muted-foreground placeholder-muted-foreground focus:ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                  />
                </div>
              </div>
            </div>
            <ChatActions
              enabled={query?.length > 0 && !isLoading}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
