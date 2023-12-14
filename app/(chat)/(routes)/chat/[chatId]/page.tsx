import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import ChatClient from "./components/ChatClient";

interface ChatIdPageProps {
  params: {
    chatId: string;
  };
}

export default async function ChatIdPage({ params }: ChatIdPageProps) {
  const { userId } = auth();

  //   沒有登路的話，就導向登入頁面
  if (!userId) {
    return redirectToSignIn();
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  console.log("companion:", companion);
  if (!companion) {
    return redirect("/");
  }

  return <ChatClient companion={companion}></ChatClient>;
}
