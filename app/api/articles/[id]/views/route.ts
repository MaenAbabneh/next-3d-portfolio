import { NextResponse } from "next/server";

import { getArticleViewsKey, getUpstashRedis } from "@/lib/upstashRedis";

function parseArticleId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isFinite(id)) return null;
  const int = Math.trunc(id);
  if (int <= 0) return null;
  return int;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const articleId = parseArticleId(rawId);
  if (articleId == null) {
    return NextResponse.json({ error: "Invalid article id" }, { status: 400 });
  }

  const redis = getUpstashRedis();
  if (!redis) {
    return NextResponse.json(
      { error: "Redis not configured" },
      { status: 501 },
    );
  }

  const key = getArticleViewsKey(articleId);
  const value = await redis.get<number>(key);

  return NextResponse.json({ id: articleId, views: value ?? 0 });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const articleId = parseArticleId(rawId);
  if (articleId == null) {
    return NextResponse.json({ error: "Invalid article id" }, { status: 400 });
  }

  const redis = getUpstashRedis();
  if (!redis) {
    return NextResponse.json(
      { error: "Redis not configured" },
      { status: 501 },
    );
  }

  const key = getArticleViewsKey(articleId);
  const views = await redis.incr(key);

  return NextResponse.json({ id: articleId, views });
}
