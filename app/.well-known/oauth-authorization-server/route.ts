const SITE_URL = "https://maenababneh.dev";

export async function GET() {
  return Response.json({
    issuer: SITE_URL,
    authorization_endpoint: `${SITE_URL}/oauth/authorize`,
    token_endpoint: `${SITE_URL}/oauth/token`,
    jwks_uri: `${SITE_URL}/.well-known/jwks.json`,
    grant_types_supported: ["authorization_code", "client_credentials"],
    response_types_supported: ["code"],
    scopes_supported: ["articles:read", "articles:write", "metrics:read"],
    token_endpoint_auth_methods_supported: [
      "client_secret_post",
      "client_secret_basic",
    ],
  });
}
