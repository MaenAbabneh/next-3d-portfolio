import { connection } from "next/server";

const SITE_URL = "https://maenababneh.dev";

export async function GET() {
  await connection();

  return Response.json(
    {
      resource: `${SITE_URL}/api`,
      authorization_servers: [SITE_URL],
      scopes_supported: ["articles:read", "articles:write", "metrics:read"],
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
