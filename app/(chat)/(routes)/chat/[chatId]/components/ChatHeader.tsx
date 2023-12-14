"use client";

import { Companion, Message } from "@prisma/client";
import React from "react";
import { Button } from "../../../../../../components/ui/button";
import { ChevronLeft, Edit, MessageSquare, MoreVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import prismadb from "@/lib/prismadb";
import BotAvatar from "./BotAvatar";
import { auth, useUser } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

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
  const { user } = useUser();
  const { toast } = useToast();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/companion/${companion.id}`);
      toast({
        description: "Success",
      });
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log("🚀 ~ file: chat-header.tsx:33 ~ onDelete ~ error:", error);
      toast({
        description: "Failed to delete companion",
        variant: "destructive",
      });
    }
  };

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
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{companion.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessageSquare className="w-3 h-3 mr-1" />
              {companion._count.messages}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Created by {companion.userName}</p>
        </div>
      </div>
      {user?.id === companion.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} size="icon">
              <MoreVertical size={"icon"} className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                router.push(`/companion/${companion.id}`);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
