"use client";

import { Companion } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";

interface ChatMessagesProps {
  companion: Companion;
  isLoading: boolean;
  messages: ChatMessageProps[];
}

export default function ChatMessages({ companion, isLoading, messages = [] }: ChatMessagesProps) {
  const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);

  console.log("messages>>>>>>>>>>>>>>>>:", messages);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto  pr-4 ">
      <ChatMessage src={companion.src} isLoading={fakeLoading} role="system" content={`Hello I am ${companion.name}, ${companion.description}`} />
      {/* <ChatMessage role="user" content={`Hello I am ${companion?.name}, ${companion?.description}`} /> */}
      {messages.map((message, index) => (
        <ChatMessage key={index} role={message.role} content={message.content} src={message.src} />
      ))}
      {isLoading && <ChatMessage role="system" src={companion.src} isLoading />}
    </div>
  );
}
