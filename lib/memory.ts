/**
 * @ Author: firstfu
 * @ Create Time: 2023-12-15 01:13:59
 * @ Description: memory manager
 */

import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { Redis } from "@upstash/redis";
import { as } from "@upstash/redis/zmscore-415f6c9f";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone | null;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = null;
  }

  public async init() {
    if (this.vectorDBClient instanceof Pinecone) {
      this.vectorDBClient = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!,
      });
    }
  }

  public async vectorSearch(recentChatHistory: string, companionFileName: string) {
    const pineconeClient = this.vectorDBClient as Pinecone;
    const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX! || "");

    const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }), {
      pineconeIndex,
    });

    const similarDocs = await vectorStore.similaritySearch(recentChatHistory, 3, { fileName: companionFileName }).catch(err => {
      console.log(err);
    });
    return similarDocs;
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }
    return MemoryManager.instance;
  }

  private generateRedisCompanionKey(companionKey: CompanionKey): string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  public async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("companion key set incorrectly");
      return;
    }
    const key = this.generateRedisCompanionKey(companionKey);
    await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });
  }

  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("companion key set incorrectly");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const history = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });
    return history.slice(-30).reverse().join("\n");
  }

  public async seedChatHistory(seedContent: string, delimiter: string = "\n", companionKey: CompanionKey) {
    const key = this.generateRedisCompanionKey(companionKey);
    if (await this.history.exists(key)) {
      console.log("history already exists");
      return;
    }
    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, {
        score: counter,
        member: line,
      });
      counter++;
    }
  }
}
