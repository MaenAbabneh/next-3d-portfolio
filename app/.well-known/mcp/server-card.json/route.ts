const SITE_URL = "https://maenababneh.dev";

export const dynamic = "force-static";

export async function GET() {
  return Response.json({
    schemaVersion: "2026-02-20",
    serverInfo: {
      name: "maenababneh-portfolio-mcp",
      version: "1.0.0",
      description: "Read-only portfolio discovery and content navigation tools",
    },
    transports: [
      {
        type: "streamable-http",
        endpoint: `${SITE_URL}/mcp`,
      },
    ],
    capabilities: {
      tools: true,
      resources: true,
      prompts: false,
    },
  });
}
