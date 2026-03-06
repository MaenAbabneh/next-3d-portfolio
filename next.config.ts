import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,

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

export default nextConfig;
