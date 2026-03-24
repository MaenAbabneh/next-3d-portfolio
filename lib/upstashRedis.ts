import { Redis } from "@upstash/redis";

let cachedRedis: Redis | null | undefined;

export function getUpstashRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    cachedRedis = null;
    return cachedRedis;
  }

  cachedRedis = Redis.fromEnv();
  return cachedRedis;
}

export function getArticleViewsKey(articleId: number) {
  return `article:${articleId}:views`;
}

export function getArticleLikesKey(articleId: number) {
  return `article:${articleId}:likes`;
}
