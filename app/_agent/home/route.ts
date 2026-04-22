import {
  buildHomeMarkdown,
  estimateMarkdownTokens,
} from "@/lib/agentHomeMarkdown";

export const dynamic = "force-static";

export async function GET() {
  const markdown = buildHomeMarkdown();

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(estimateMarkdownTokens(markdown)),
      Vary: "Accept",
    },
  });
}
