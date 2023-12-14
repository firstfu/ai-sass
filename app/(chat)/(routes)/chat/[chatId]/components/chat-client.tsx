"use client";

import ChatHeader from "@/app/(chat)/(routes)/chat/[chatId]/components/chat-header";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { useCompletion } from "ai/react";
import ChatForm from "./ChatForm";
import ChatMessages from "./ChatMessages";
import { ChatMessageProps } from "./ChatMessage";

interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export default function ChatClient({ companion }: ChatClientProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);
  console.log("messages:", messages);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } = useCompletion({
    api: `/api/chat/${companion.id}`,
    onFinish(prompt, completion) {
      const systemMessage: ChatMessageProps = {
        role: "system",
        content: completion,
      };
      setMessages(messages => [...messages, systemMessage]);
      setInput("");
      router.refresh();
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };
    setMessages(messages => [...messages, userMessage]);
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion}></ChatHeader>
      <ChatMessages companion={companion} isLoading={isLoading} messages={messages} />
      <ChatForm isLoading={isLoading} input={input} handleInputChange={handleInputChange} onSubmit={onSubmit}></ChatForm>
    </div>
  );
}
