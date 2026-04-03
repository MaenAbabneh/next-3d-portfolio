"use client";

import type { ComponentType } from "react";
import { getArticleSlug } from "@/utils/articleSlug";

import Article1 from "@/content/articles/article-1.mdx";
import Article2 from "@/content/articles/article-2.mdx";
import Article3 from "@/content/articles/article-3.mdx";

import {
  ARTICLES_CONTENT,
  type ArticleBase,
  type ArticleTocItem,
} from "@/constant/articlesContent";

export type Article = ArticleBase & {
  Content: ComponentType;
};

export type { ArticleTocItem };

export function resolveArticleIdFromParam(param: string): number | null {
  const foundBySlug = ARTICLES_DATA.find(
    (article) => getArticleSlug(article) === param,
  );
  return foundBySlug?.id ?? null;
}

const CONTENT_BY_ID = new Map<number, ArticleBase>(
  ARTICLES_CONTENT.map((a) => [a.id, a]),
);

export const ARTICLES_DATA: Article[] = [
  { ...CONTENT_BY_ID.get(1)!, Content: Article1 },
  { ...CONTENT_BY_ID.get(2)!, Content: Article2 },
  { ...CONTENT_BY_ID.get(3)!, Content: Article3 },
];
