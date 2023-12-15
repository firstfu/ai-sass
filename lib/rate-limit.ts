/**
 * @ Author: firstfu
 * @ Create Time: 2023-12-15 03:26:40
 * @ Description: Redis limit
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export async function rateLimit(identifier: string) {
  const rateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
  });

  return await rateLimit.limit(identifier);
}
