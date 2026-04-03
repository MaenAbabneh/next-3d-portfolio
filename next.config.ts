import type { NextConfig } from "next";

import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx$/,
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
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
  },
};

export default withMDX(nextConfig);
