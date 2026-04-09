import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://maenababneh.dev/sitemap.xml",
    host: "https://maenababneh.dev",
  };
}
