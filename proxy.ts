import { NextRequest, NextResponse } from "next/server";

import {
  buildHomeMarkdown,
  estimateMarkdownTokens,
} from "@/lib/agentHomeMarkdown";

function wantsMarkdown(request: NextRequest): boolean {
  const accept = request.headers.get("accept")?.toLowerCase() ?? "";
  return accept.includes("text/markdown");
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  if (request.method !== "GET") {
    return NextResponse.next();
  }

  if (!wantsMarkdown(request)) {
    return NextResponse.next();
  }

  const markdown = buildHomeMarkdown();

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown",
      "x-markdown-tokens": String(estimateMarkdownTokens(markdown)),
      Vary: "Accept",
    },
  });
}

export const config = {
  matcher: ["/"],
};
