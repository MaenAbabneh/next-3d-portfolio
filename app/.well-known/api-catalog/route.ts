const SITE_URL = "https://maenababneh.dev";

export const dynamic = "force-static";

export async function GET() {
  const body = {
    linkset: [
      {
        anchor: `${SITE_URL}/api`,
        "service-desc": [
          {
            href: `${SITE_URL}/openapi.json`,
            type: "application/vnd.oai.openapi+json;version=3.1",
          },
        ],
        "service-doc": [
          {
            href: `${SITE_URL}/docs/api`,
            type: "text/html",
            hreflang: ["en", "ar"],
          },
        ],
        status: [
          {
            href: `${SITE_URL}/api/health`,
            type: "application/json",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
