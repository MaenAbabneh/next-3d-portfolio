"use client";

import { ARTICLES_DATA } from "@/constant/articlesData";
import { useArticleStore } from "@/store/useArticleStore";
import WackyHeart from "../accessories/WackyHeart";
import gsap from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ModalLayout from "./ModalLayout";
import { useGSAP } from "@gsap/react";

type ArticlesSidebarOverlayProps = {
  panelRef?: React.RefObject<HTMLDivElement | null>;
  onLayoutChange?: () => void;
};

export default function ArticlesSidebarOverlay({
  panelRef,
  onLayoutChange,
}: ArticlesSidebarOverlayProps) {
  const {
    activeArticleId,
    isSidebarOpen,
    likesById,
    pendingLikesById,
    fetchLikes,
    incrementLikesBy,
  } = useArticleStore();

  const shouldRender = isSidebarOpen && activeArticleId != null;
  const shouldBeOpen = shouldRender;

  const tocItemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const retroRowRef = useRef<HTMLDivElement | null>(null);
  const retroHeartRef = useRef<HTMLDivElement | null>(null);
  const retroScoreRef = useRef<HTMLDivElement | null>(null);

  const [cachedArticleId, setCachedArticleId] = useState<number | null>(() => {
    const initial = useArticleStore.getState();
    return initial.activeArticleId;
  });

  useEffect(() => {
    const unsubscribe = useArticleStore.subscribe((state) => {
      if (state.isSidebarOpen && state.activeArticleId != null) {
        setCachedArticleId(state.activeArticleId);
      }
    });

    return unsubscribe;
  }, []);

  const [likesCount, setLikesCount] = useState(0);
  const lastClicksRef = useRef(0);

  useEffect(() => {
    if (!shouldRender || activeArticleId == null) return;
    lastClicksRef.current = 0;
    fetchLikes(activeArticleId);
  }, [activeArticleId, fetchLikes, shouldRender]);

  const handleLikesChange = useCallback(
    (clicks: number) => {
      setLikesCount(clicks);

      if (activeArticleId == null) return;

      const prev = lastClicksRef.current;
      const delta = clicks - prev;
      lastClicksRef.current = clicks;

      if (delta !== 0) incrementLikesBy(activeArticleId, delta);
    },
    [activeArticleId, incrementLikesBy],
  );

  const localPanelRef = useRef<HTMLDivElement | null>(null);

  const setPanelNodeRef = (node: HTMLDivElement | null) => {
    localPanelRef.current = node;
    if (panelRef) panelRef.current = node;
  };

  useGSAP(() => {
    const el = localPanelRef.current;
    if (!el) return;

    gsap.killTweensOf(el);

    if (shouldBeOpen) {
      gsap.set(el, { opacity: 0, x: 900, rotation: 0 });
      gsap.to(el, {
        x: 1150,
        opacity: 1,
        duration: 0.75,
        ease: "power2.inOut",
        onUpdate: onLayoutChange,
      });
    } else {
      gsap.to(el, {
        x: 900,
        opacity: 0,
        duration: 0.75,
        ease: "power3.inOut",
        onComplete: () => {
          const s = useArticleStore.getState();
          if (!(s.isSidebarOpen && s.activeArticleId != null)) {
            setCachedArticleId(null);
          }
          if (onLayoutChange) onLayoutChange();
        },
      });
    }
  }, [cachedArticleId, shouldBeOpen, onLayoutChange]);

  const effectiveArticleId = activeArticleId ?? cachedArticleId;
  const activeArticle =
    effectiveArticleId == null
      ? null
      : (ARTICLES_DATA.find((a) => a.id === effectiveArticleId) ?? null);

  const tocItems = useMemo(() => {
    if (!activeArticle) return [];
    return activeArticle.toc || [];
  }, [activeArticle]);

  // GSAP animation for TOC items (slide in from right)
  useGSAP(() => {
    if (!shouldBeOpen || !tocItemsRef.current.length) return;
    gsap.killTweensOf(tocItemsRef.current);
    gsap.set(tocItemsRef.current, { opacity: 0, x: 40 });
    gsap.to(tocItemsRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.07,
      delay: 0.75,
      ease: "power2.out",
      overwrite: true,
    });
  }, [shouldBeOpen, tocItems.length, effectiveArticleId]);

  // GSAP animation for Retro Scoreboard row (slide in from right)
  useGSAP(() => {
    if (!shouldBeOpen || !retroRowRef.current) return;
    // Animate the row container
    gsap.killTweensOf(retroRowRef.current);
    gsap.set(retroRowRef.current, { opacity: 0, x: 40 });
    gsap.to(retroRowRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      delay: 0.75,
      ease: "power2.out",
      overwrite: true,
    });
    // Animate heart and score separately for a nice stagger
    if (retroHeartRef.current && retroScoreRef.current) {
      gsap.set([retroHeartRef.current, retroScoreRef.current], {
        opacity: 0,
        x: 40,
      });
      gsap.to([retroHeartRef.current, retroScoreRef.current], {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: 0.85,
        stagger: 0.08,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }, [shouldBeOpen, effectiveArticleId]);

  const scrollToHeading = (headingId: string) => {
    if (!shouldRender) return;

    const container = document.querySelector(
      '[data-articles-scroll-container="1"]',
    ) as HTMLElement | null;
    if (!container) return;

    const heading = document.getElementById(headingId);
    if (!heading) return;

    if (!container.contains(heading)) return;

    heading.scrollIntoView({ behavior: "smooth", block: "start" });

    const offset = 140;
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const containerNow = document.querySelector(
          '[data-articles-scroll-container="1"]',
        ) as HTMLElement | null;
        if (!containerNow) return;

        const containerRect = containerNow.getBoundingClientRect();
        const headingRect = heading.getBoundingClientRect();
        const delta = headingRect.top - containerRect.top;

        containerNow.scrollTo({
          top: Math.max(0, containerNow.scrollTop + delta - offset),
          behavior: "smooth",
        });
      });
    });
  };

  if (effectiveArticleId == null) return null;

  const serverLikes = likesById[effectiveArticleId];
  const pendingLikes = pendingLikesById[effectiveArticleId] ?? 0;
  const displayLikes =
    typeof serverLikes === "number" && Number.isFinite(serverLikes)
      ? Math.max(0, Math.trunc(serverLikes) + pendingLikes)
      : pendingLikes !== 0
        ? Math.max(0, Math.trunc(pendingLikes))
        : Math.max(0, Math.trunc(likesCount));
  const retroScore = displayLikes.toString().padStart(5, "0");
  const firstNonZeroIndex = retroScore.search(/[1-9]/);
  const firstSignificantIndex =
    firstNonZeroIndex === -1 ? retroScore.length - 1 : firstNonZeroIndex;
  const retroDigits = retroScore.split("").map((ch, idx) => ({
    ch,
    isDimmed: ch === "0" && idx < firstSignificantIndex,
  }));

  return (
    <div
      ref={setPanelNodeRef}
      className="fixed left-6 top-24 md:top-1/2 md:-translate-y-1/2 z-90 w-full max-w-105 max-h-[80vh]"
    >
      <ModalLayout
        title="Table of Contents"
        className="w-full h-full"
        showCloseButton={false}
      >
        <div className="flex flex-col gap-6">
          {tocItems.length ? (
            <div className="flex flex-col gap-2">
              {tocItems.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  ref={(el) => {
                    tocItemsRef.current[idx] = el;
                  }}
                  onClick={() => scrollToHeading(item.id)}
                  className="text-left p-1 hover:scale-102 transition-transform cursor-pointer"
                  // style={{
                  //   paddingInlineStart: item.depth === 3 ? 22 : 12,
                  // }}
                >
                  <p className="font-bold text-base text-base-brwan hover:text-base-blue hover:dark:text-base-blue-dark transition-colors">
                    {item.label}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm font-bold opacity-70">
              لا يوجد عناوين بعد لهذا المقال.
            </p>
          )}

          {/* التعديل هنا: قسم العملة والعداد الـ Retro */}
          <div
            ref={retroRowRef}
            className="pt-6 mt-auto border-t-4 border-dashed border-base-blue/20 flex flex-row items-center justify-start gap-2 px-0 w-full"
          >
            <div
              ref={retroHeartRef}
              className="shrink-0 flex items-center justify-center"
            >
              <WackyHeart size={120} onClicksChange={handleLikesChange} />
            </div>

            {/* تصميم العداد (Retro Scoreboard) */}
            <div
              ref={retroScoreRef}
              className="flex flex-col items-center shrink-0"
            >
              <div className="bg-black/85 border-4 border-base-blue dark:border-base-blue-dark rounded-md px-3 py-1 shadow-inner flex items-center justify-center w-auto">
                <p className="font-digital animate-flicker text-3xl font-black text-base-blue dark:text-base-blue-dark tracking-widest leading-none translate-x-1 drop-shadow-[0_0_8px_rgba(41,82,155,0.6)]">
                  {retroDigits.map(({ ch, isDimmed }, idx) => (
                    <span
                      key={idx}
                      className={isDimmed ? "opacity-30 drop-shadow-none" : ""}
                    >
                      {ch}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ModalLayout>
    </div>
  );
}
