import { slugifyHeading } from "@/utils/slugifyHeading";

export function getArticleSlug(article: { id: number; title: string }) {
  return slugifyHeading(article.title) ?? `article-${article.id}`;
}
