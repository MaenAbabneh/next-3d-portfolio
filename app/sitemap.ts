import type { MetadataRoute } from "next";

import { ARTICLES_CONTENT } from "@/constant/articlesContent";
import { getArticleSlug } from "@/utils/articleSlug";

const SITE_URL = "https://maenababneh.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const articleEntries: MetadataRoute.Sitemap = ARTICLES_CONTENT.map(
    (article) => ({
      url: `${SITE_URL}/articles/${getArticleSlug(article)}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...articleEntries,
  ];
}
