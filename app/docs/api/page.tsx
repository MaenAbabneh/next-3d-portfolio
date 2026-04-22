export const metadata = {
  title: "API Documentation",
  description:
    "Machine and human-friendly API documentation for maenababneh.dev",
};

const BASE_URL = "https://maenababneh.dev";

export default function ApiDocsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">API Documentation</h1>
      <p className="mt-4 text-base leading-7">
        This site exposes simple public endpoints for article engagement metrics
        and service health checks.
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-semibold">OpenAPI</h2>
        <p>
          The OpenAPI description is available at{" "}
          <a className="underline" href="/openapi.json">
            {BASE_URL}/openapi.json
          </a>
          .
        </p>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-2xl font-semibold">Endpoints</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>GET /api/articles/{"{id}"}/likes</li>
          <li>POST /api/articles/{"{id}"}/likes</li>
          <li>GET /api/articles/{"{id}"}/views</li>
          <li>POST /api/articles/{"{id}"}/views</li>
          <li>GET /api/health</li>
        </ul>
      </section>
    </main>
  );
}
