import type { NextConfig } from "next";

import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx$/,
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value:
              '</.well-known/api-catalog>; rel="api-catalog", </openapi.json>; rel="service-desc", </docs/api>; rel="service-doc", </.well-known/openid-configuration>; rel="describedby", </.well-known/oauth-protected-resource>; rel="describedby", </.well-known/mcp/server-card.json>; rel="describedby", </.well-known/agent-skills/index.json>; rel="describedby"',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/article/:id",
        destination: "/articles/:id",
        permanent: true,
      },
    ];
  },
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: [
      "@react-three/drei",
      "@gsap/react",
      "howler",
      "react-icons",
      "three",
    ],
    webpackBuildWorker: true,
  },
};

export default withMDX(nextConfig);
