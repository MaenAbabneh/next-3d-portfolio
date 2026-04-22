const SITE_URL = "https://maenababneh.dev";

export const dynamic = "force-static";

export async function GET() {
  return Response.json({
    resource: `${SITE_URL}/api`,
    authorization_servers: [SITE_URL],
    scopes_supported: ["articles:read", "articles:write", "metrics:read"],
  });
}
