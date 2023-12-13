"use client";

import { Companion, Message } from "@prisma/client";
import React from "react";
import { Button } from "../../../../../../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import prismadb from "@/lib/prismadb";
import BotAvatar from "./BotAvatar";

interface ChatHeaderProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export default function ChatHeader({ companion }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            console.log("回退");
            router.back();
          }}
        >
          <ChevronLeft size={"icon"} className="h-8 w-8" />
        </Button>
        <BotAvatar src={companion.src} />
      </div>
    </div>
  );
}
