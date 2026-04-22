export async function GET() {
  return Response.json({
    status: "ok",
    service: "portfolio-api",
    timestamp: new Date().toISOString(),
  });
}
