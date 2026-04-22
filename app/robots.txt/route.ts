const SITE_URL = "https://maenababneh.dev";

const ROBOTS_TXT = [
  "User-agent: *",
  "Allow: /",
  "Content-Signal: ai-train=no, search=yes, ai-input=no",
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  `Host: ${SITE_URL}`,
  "",
].join("\n");

export async function GET() {
  return new Response(ROBOTS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
