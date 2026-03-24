import { NextResponse } from "next/server";

import { getArticleLikesKey, getUpstashRedis } from "@/lib/upstashRedis";

function parseArticleId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isFinite(id)) return null;
  const int = Math.trunc(id);
  if (int <= 0) return null;
  return int;
}

function parseDelta(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 1;
  const int = Math.trunc(value);
  if (int === 0) return 1;
  // keep requests bounded to avoid abuse
  const bounded = Math.max(-25, Math.min(25, int));
  return bounded === 0 ? (int > 0 ? 1 : -1) : bounded;
}

const CLAMPED_INCR_SCRIPT = `
local key = KEYS[1]
local delta = tonumber(ARGV[1])
local v = redis.call('INCRBY', key, delta)
if v < 0 then
  redis.call('SET', key, 0)
  v = 0
end
return v
`;

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

  const key = getArticleLikesKey(articleId);
  const value = await redis.get<number>(key);

  return NextResponse.json({ id: articleId, likes: Math.max(0, value ?? 0) });
}

export async function POST(
  request: Request,
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

  const body = await request.json().catch(() => ({}));
  const by = parseDelta((body as { by?: unknown }).by);

  const key = getArticleLikesKey(articleId);
  const likes = await redis.eval<[number], number>(
    CLAMPED_INCR_SCRIPT,
    [key],
    [by],
  );

  return NextResponse.json({ id: articleId, likes, by });
}
