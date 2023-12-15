import { MemoryManager } from "@/lib/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { currentUser, auth } from "@clerk/nextjs";
import { StreamingTextResponse, LangChainStream } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { chatId: string } }) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = request.url + "-" + user.id;
    const { success } = await rateLimit(identifier);
    if (!success) {
      return new NextResponse("Too many requests", { status: 429 });
    }
    const companion = await prismadb.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
      include: {
        messages: true,
      },
    });
    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    const name = companion.id;
    const companionFileName = name + ".txt";
    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "llama2-13b",
    };
    const memoryManager = await MemoryManager.getInstance();
    const records = await memoryManager.readLatestHistory(companionKey);
    if (records.length == 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    }
    await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);
    const recentChatHistory = await memoryManager.readLatestHistory(companionKey);
    const similarDocs = await memoryManager.vectorSearch(recentChatHistory, companionFileName);

    let relevantHistory = "";
    if (!!similarDocs && similarDocs.length > 0) {
      relevantHistory = similarDocs.map(doc => doc.pageContent).join("\n");
    }
    const { handlers } = LangChainStream();
    const model = new Replicate({
      model: "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbacks: CallbackManager.fromHandlers(handlers),
    });

    model.verbose = true;
    const resp = String(
      await model
        .call(
          `
          ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix.

          ${companion.instructions}

          Below are relevant details about ${companion.name}'s past and the conversation you are in.
          ${relevantHistory}


          ${recentChatHistory}\n${companion.name}:`
        )
        .catch(console.error)
    );

    const cleaned = resp.replaceAll(",", "");
    const chunks = cleaned.split("\n");
    const response = chunks[0];
    await memoryManager.writeToHistory("" + response.trim(), companionKey);
    // TODO: 為什麼這裡要用 stream
    var Readable = require("stream").Readable;
    let s = new Readable();
    s.push(null);
    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory("" + response.trim(), companionKey);
      await prismadb.companion.update({
        where: {
          id: params.chatId,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });
    }
    return new StreamingTextResponse(s);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:15 ~ POST ~ error:", error);
    return new NextResponse("internal Error", { status: 500 });
  }
}
