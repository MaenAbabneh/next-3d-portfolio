"use client";

import { ARTICLES_DATA, type Article } from "@/constant/articlesData";
import { useArticleStore } from "@/store/useArticleStore";
import { useEffect, useRef } from "react";
import ArticleDetailView from "./articles/ArticleDetailView";
import ArticleListView from "./articles/ArticleListView";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";

// تسجيل إضافة Flip (داخل المتصفح فقط لتجنب أخطاء السيرفر)
if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

export default function ArticlesSection() {
  const {
    activeArticleId,
    openArticle,
    closeArticle,
    incrementViews,
    viewsDeltaById,
    viewsById,
    pendingViewsById,
    bookmarkedIds,
    toggleBookmark,
  } = useArticleStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const flipTargetArticleIdRef = useRef<number | null>(null);

  const activeArticle: Article | null =
    activeArticleId == null
      ? null
      : (ARTICLES_DATA.find((a) => a.id === activeArticleId) ?? null);

  const isInitialMountRef = useRef(true);

  const getFlipTargets = (articleId: number | null) => {
    const scope = containerRef.current;
    if (!scope) return [] as HTMLElement[];
    if (articleId == null) return [] as HTMLElement[];

    // Target only the shared elements for the specific article.
    return gsap.utils.toArray<HTMLElement>(
      `[data-flip-id="img-${articleId}"], [data-flip-id="title-${articleId}"], [data-flip-id="date-${articleId}"], [data-flip-id="excerpt-${articleId}"]`,
      scope,
    );
  };

  // دوال التقاط الحالة قبل فتح أو إغلاق المقال
  const handleOpenArticle = (id: number) => {
    flipTargetArticleIdRef.current = id;
    flipStateRef.current = Flip.getState(getFlipTargets(id));
    openArticle(id);
  };

  const handleCloseArticle = () => {
    // activeArticleId is still set here; store it so we can find list targets after close.
    flipTargetArticleIdRef.current = activeArticleId;
    flipStateRef.current = Flip.getState(getFlipTargets(activeArticleId));
    closeArticle();
  };

  // تشغيل الأنيميشن بعد التبديل
  useGSAP(
    () => {
      if (!flipStateRef.current) return;

      const targets = getFlipTargets(
        flipTargetArticleIdRef.current ?? activeArticleId,
      );
      if (!targets.length) {
        flipStateRef.current = null;
        flipTargetArticleIdRef.current = null;
        return;
      }

      Flip.from(flipStateRef.current, {
        targets,
        duration: 0.5,
        ease: "power2.inOut",
        scale: true, // مهم جداً لتكبير/تصغير الصورة بسلاسة
        // simple: true,
        absolute: false,
        // nested: true,
        onComplete: () => {
          flipStateRef.current = null;
          flipTargetArticleIdRef.current = null;
        },
      });
    },
    { dependencies: [activeArticleId], scope: containerRef },
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!activeArticle) {
      if (isInitialMountRef.current) {
        isInitialMountRef.current = false;
        return;
      }

      const params = new URLSearchParams(window.location.search);
      if (params.has("article")) {
        params.delete("article");
        const qs = params.toString();
        const url = qs
          ? `${window.location.pathname}?${qs}`
          : window.location.pathname;
        window.history.replaceState(null, "", url);
      }
      return;
    }

    isInitialMountRef.current = false;

    void incrementViews(activeArticle.id);

    const params = new URLSearchParams(window.location.search);
    const next = String(activeArticle.id);
    if (params.get("article") !== next) {
      params.set("article", next);
      const url = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", url);
    }
  }, [activeArticle, incrementViews]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {activeArticle ? (
        (() => {
          const serverViews = viewsById[activeArticle.id];
          const delta = viewsDeltaById[activeArticle.id] ?? 0;
          const pending = pendingViewsById[activeArticle.id] ?? 0;
          const views =
            typeof serverViews === "number" && Number.isFinite(serverViews)
              ? serverViews + pending
              : activeArticle.views + delta + pending;

          return (
            <ArticleDetailView
              article={activeArticle}
              displayViews={views}
              isBookmarked={!!bookmarkedIds[activeArticle.id]}
              onClose={handleCloseArticle}
              onOpenArticle={handleOpenArticle}
              onToggleBookmark={toggleBookmark}
            />
          );
        })()
      ) : (
        <ArticleListView
          articles={ARTICLES_DATA}
          bookmarkedIds={bookmarkedIds}
          onOpenArticle={handleOpenArticle}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </div>
  );
}
