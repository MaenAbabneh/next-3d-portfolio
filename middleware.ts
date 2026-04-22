import { NextRequest, NextResponse } from "next/server";

function wantsMarkdown(request: NextRequest): boolean {
  const accept = request.headers.get("accept")?.toLowerCase() ?? "";
  return accept.includes("text/markdown");
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  if (request.method !== "GET") {
    return NextResponse.next();
  }

  if (!wantsMarkdown(request)) {
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = "/_agent/home";

  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set("Vary", "Accept");

  return response;
}

export const config = {
  matcher: ["/"],
};
