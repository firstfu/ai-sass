"use client";

import React, { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

interface ChatFormProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions | undefined) => void;
  isLoading: boolean;
}

export default function ChatForm({ input, handleInputChange, onSubmit, isLoading }: ChatFormProps) {
  return (
    <div>
      <form onSubmit={onSubmit} className="border-t border-primary/10 py-4 flex items-center gap-x-2">
        <Input disabled={isLoading} value={input} onChange={handleInputChange} placeholder="Type a message" className="rounded-lg bg-primary/10"></Input>
        <Button disabled={isLoading} variant={"ghost"}>
          <SendHorizonal />
        </Button>
      </form>
    </div>
  );
}
