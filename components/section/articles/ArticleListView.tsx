"use client";

import Image from "next/image";
import type { Article } from "@/constant/articlesData";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { useMemo } from "react";
import { useArticleStore } from "@/store/useArticleStore";
import { useShallow } from "zustand/react/shallow";

type ArticleListViewProps = {
  articles: Article[];
  bookmarkedIds: Record<number, boolean>;
  onOpenArticle: (id: number) => void;
  onToggleBookmark: (id: number) => void;
};

export default function ArticleListView({
  articles,
  bookmarkedIds,
  onOpenArticle,
  onToggleBookmark,
}: ArticleListViewProps) {
  const {
    searchQuery,
    selectedCategory,
    bookmarkedOnly,
    setSearchQuery,
    setSelectedCategory,
    setBookmarkedOnly,
  } = useArticleStore(
    useShallow((s) => ({
      searchQuery: s.searchQuery,
      selectedCategory: s.selectedCategory,
      bookmarkedOnly: s.bookmarkedOnly,
      setSearchQuery: s.setSearchQuery,
      setSelectedCategory: s.setSelectedCategory,
      setBookmarkedOnly: s.setBookmarkedOnly,
    })),
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      if (a.category && a.category.trim()) set.add(a.category.trim());
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLocaleLowerCase();
    const terms: string[] = q ? q.split(/\s+/).filter(Boolean) : [];

    return articles.filter((article) => {
      if (selectedCategory && article.category !== selectedCategory) {
        return false;
      }

      if (bookmarkedOnly && !bookmarkedIds[article.id]) {
        return false;
      }

      if (!terms.length) return true;

      const haystack = `${article.title} ${article.excerpt} ${article.category}`
        .toLocaleLowerCase()
        .trim();

      // Multi-term search: all terms must match.
      return terms.every((t: string) => haystack.includes(t));
    });
  }, [articles, searchQuery, selectedCategory, bookmarkedOnly, bookmarkedIds]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full sm:flex-1 rounded-2xl border-4 border-base-blue/60 dark:border-base-blue-dark/60 bg-white/60 dark:bg-white/5 px-4 py-3 text-base-brwan outline-none"
          aria-label="Search articles"
        />

        <select
          value={selectedCategory ?? ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="w-full sm:w-60 rounded-2xl border-4 border-base-blue/60 dark:border-base-blue-dark/60 bg-white/60 dark:bg-white/5 px-4 py-3 text-base-brwan  outline-none"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
          className="w-full sm:w-auto rounded-2xl border-4 border-base-blue/60 dark:border-base-blue-dark/60 bg-white/60 dark:bg-white/5 px-4 py-3 text-base-brwan  hover:scale-[1.02] transition-transform"
          aria-pressed={bookmarkedOnly}
        >
          {bookmarkedOnly ? "Saved" : "All"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpenArticle(article.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenArticle(article.id);
              }
            }}
            className="p-6 border-4 border-base-blue/60 dark:border-base-blue-dark/60 rounded-2xl cursor-pointer hover:bg-base-blue/5 transition-colors flex flex-col sm:flex-row gap-6 items-center"
          >
            {article.image && (
              <div
                data-flip-id={`img-${article.id}`}
                className="w-full sm:w-1/3 h-40 rounded-xl overflow-hidden shrink-0 relative flip-element origin-top-left will-change-transform"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <h3
                  data-flip-id={`title-${article.id}`}
                  className="text-2xl font-bold mb-2 flip-element origin-top-left will-change-transform"
                >
                  {article.title}
                </h3>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleBookmark(article.id);
                  }}
                  className="shrink-0 rounded-xl border-4 border-base-blue/60 dark:border-base-blue-dark/60 bg-white/60 dark:bg-white/5 px-3 py-2 text-base-brwan hover:scale-[1.02] transition-transform"
                  aria-label={
                    bookmarkedIds[article.id]
                      ? "Remove bookmark"
                      : "Add bookmark"
                  }
                >
                  {bookmarkedIds[article.id] ? (
                    <IoBookmark />
                  ) : (
                    <IoBookmarkOutline />
                  )}
                </button>
              </div>
              <p
                data-flip-id={`date-${article.id}`}
                className="text-sm opacity-70 mb-2 flip-element origin-top-left will-change-transform"
              >
                {article.date}
              </p>
              <p
                data-flip-id={`excerpt-${article.id}`}
                className="text-base flip-element origin-top-left will-change-transform"
              >
                {article.excerpt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="p-6 border-4 border-base-blue/60 dark:border-base-blue-dark/60 rounded-2xl opacity-70">
          No articles found.
        </div>
      ) : null}
    </div>
  );
}
