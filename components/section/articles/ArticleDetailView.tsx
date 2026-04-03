"use client";

import Image from "next/image";
import type { Article } from "@/constant/articlesData";
import { ARTICLES_DATA } from "@/constant/articlesData";
import { getArticleSlug } from "@/utils/articleSlug";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useEffect, useRef, useState } from "react";
import {
  IoArrowBackOutline,
  IoBookmark,
  IoBookmarkOutline,
  IoMoonOutline,
  IoSunnyOutline,
  IoCopyOutline,
  IoCheckmark,
} from "react-icons/io5";
import ArticleMdxContent from "./ArticleMdxContent";
import NewsletterSubscribe from "./NewsletterSubscribe";
import { useTheme } from "next-themes";

if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin);
}

type ArticleDetailViewProps = {
  article: Article;
  displayViews: number;
  isBookmarked: boolean;
  onClose: () => void;
  onOpenArticle: (id: number) => void;
  onToggleBookmark: (id: number) => void;
};

export default function ArticleDetailView({
  article,
  displayViews,
  isBookmarked,
  onClose,
  onOpenArticle,
  onToggleBookmark,
}: ArticleDetailViewProps) {
  const viewRef = useRef<HTMLDivElement | null>(null);
  const saveTextRef = useRef<HTMLSpanElement>(null);
  const saveIconWrapperRef = useRef<HTMLDivElement>(null);
  const themeIconWrapperRef = useRef<HTMLDivElement>(null);

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useGSAP(
    () => {
      const el = viewRef.current;
      if (!el) return;

      gsap.killTweensOf(el.querySelectorAll(".fade-in-element"));
      gsap.fromTo(
        el.querySelectorAll(".fade-in-element"),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
    },
    { dependencies: [article.id] },
  );

  // ==========================================
  // 🌟 GSAP: Animetion for (Save Button) 🌟
  // ==========================================
  useGSAP(() => {
    if (!saveTextRef.current || !saveIconWrapperRef.current || !mounted) return;

    const outlineIcon =
      saveIconWrapperRef.current.querySelector(".save-outline");
    const solidIcon = saveIconWrapperRef.current.querySelector(".save-solid");

    gsap.killTweensOf(outlineIcon);
    gsap.killTweensOf(solidIcon);
    gsap.killTweensOf(saveTextRef.current);

    if (isBookmarked) {
      gsap.to(outlineIcon, {
        scale: 0,
        rotation: -90,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(2)",
      });
      gsap.fromTo(
        solidIcon,
        { scale: 0, rotation: 90, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(3)",
          delay: 0.1,
        },
      );
      // TextPlugin in Work!
      gsap.to(saveTextRef.current, {
        duration: 0.3,
        text: "Saved",
        color: "#29529b",
        ease: "power1.inOut",
      });
    } else {
      gsap.to(solidIcon, {
        scale: 0,
        rotation: -90,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(2)",
      });
      gsap.fromTo(
        outlineIcon,
        { scale: 0, rotation: 90, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.4,
          ease: "back.out(3)",
          delay: 0.1,
        },
      );
      // تفريغ اللون ليعود للون الأصلي (Tailwind)
      gsap.to(saveTextRef.current, {
        duration: 0.3,
        text: "Save",
        clearProps: "color",
        ease: "power1.inOut",
      });
    }
  }, [isBookmarked, mounted]);

  // ==========================================
  // 🌟 GSAP: Animetion for (Theme Toggle) 🌟
  // ==========================================
  useGSAP(() => {
    if (!themeIconWrapperRef.current || !mounted) return;

    const moonIcon = themeIconWrapperRef.current.querySelector(".theme-moon");
    const sunIcon = themeIconWrapperRef.current.querySelector(".theme-sun");

    gsap.killTweensOf(moonIcon);
    gsap.killTweensOf(sunIcon);

    if (resolvedTheme === "dark") {
      gsap.to(moonIcon, {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.4,
        ease: "back.in(2)",
      });
      gsap.fromTo(
        sunIcon,
        { scale: 0, rotation: -180, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          delay: 0.1,
        },
      );
    } else {
      gsap.to(sunIcon, {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.4,
        ease: "back.in(2)",
      });
      gsap.fromTo(
        moonIcon,
        { scale: 0, rotation: -180, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          delay: 0.1,
        },
      );
    }
  }, [resolvedTheme, mounted]);

  const Content = article.Content;
  const retroViews = displayViews.toString().padStart(6, "0");

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/articles/${getArticleSlug(article)}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        return;
      }
    } catch {
      // fall through
    }
    // ... fallback
  };

  const suggested = ARTICLES_DATA.filter((a) => a.id !== article.id)
    .slice(0, 2)
    .map((a) => a);

  // ==========================================
  // 🌟 functions for handle (Hover & Click) 🌟
  // ==========================================

  // 1. Back
  const handleBackHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector("svg"), {
      x: -5,
      scale: 1.1,
      duration: 0.3,
      ease: "back.out(2)",
    });
  };
  const handleBackLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector("svg"), {
      x: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // 2. Copy
  const handleCopyHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector(".icon-wrapper"), {
      y: -3,
      scale: 1.1,
      duration: 0.3,
      ease: "back.out(2)",
    });
  };
  const handleCopyLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector(".icon-wrapper"), {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const onCopyClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const copyIcon = btn.querySelector(".copy-icon");
    const checkIcon = btn.querySelector(".check-icon");
    const textEl = btn.querySelector(".copy-text");

    gsap
      .timeline()
      .to(btn, { scale: 0.9, duration: 0.1 })
      .to(btn, {
        scale: 1.05,
        borderColor: "rgba(16, 185, 129, 0.5)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        duration: 0.2,
        ease: "back.out(3)",
      })
      .to(btn, { scale: 1, duration: 0.1 });

    gsap.to(copyIcon, {
      rotation: 90,
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "back.in(2)",
    });
    gsap.fromTo(
      checkIcon,
      { rotation: -90, scale: 0, opacity: 0 },
      {
        rotation: 0,
        scale: 1.2,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(3)",
        delay: 0.1,
      },
    );

    gsap.to(textEl, {
      duration: 0.3,
      text: "Copied!",
      color: "#10b981",
      ease: "power1.inOut",
    });

    await handleCopyLink();

    setTimeout(() => {
      gsap.to(btn, { borderColor: "", backgroundColor: "", duration: 0.4 });
      gsap.to(checkIcon, {
        rotation: 90,
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(2)",
      });
      gsap.to(copyIcon, {
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(3)",
        delay: 0.1,
      });
      gsap.to(textEl, {
        duration: 0.3,
        text: "Copy link",
        clearProps: "color",
        ease: "power1.inOut",
      });
    }, 2000);
  };

  // 3. Save
  const handleSaveHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector(".icon-wrapper"), {
      scale: 1.15,
      rotation: 10,
      duration: 0.3,
      ease: "back.out(2)",
    });
  };
  const handleSaveLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector(".icon-wrapper"), {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const onSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;

    gsap.killTweensOf(btn);

    gsap
      .timeline()
      .to(btn, { scale: 0.9, duration: 0.1, ease: "power1.inOut" })
      .to(btn, {
        scale: 1.05,
        borderColor: "rgba(41, 82, 155, 0.4)",
        duration: 0.2,
        ease: "back.out(3)",
      })
      .to(btn, { scale: 1, borderColor: "", duration: 0.2, delay: 0.1 }); // وميض أزرق للحدود

    onToggleBookmark(article.id);
  };

  // 4. Theme
  const handleThemeHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector(".icon-wrapper"), {
      rotation: 20,
      scale: 1.1,
      duration: 0.3,
      ease: "back.out(2)",
    });
  };
  const handleThemeLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget.querySelector(".icon-wrapper"), {
      rotation: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };
  const onThemeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;

    gsap.killTweensOf(btn);

    gsap
      .timeline()
      .to(btn, { rotation: 15, scale: 0.9, duration: 0.1 })
      .to(btn, { rotation: -15, scale: 1.1, duration: 0.15 })
      .to(btn, { rotation: 0, scale: 1, duration: 0.2, ease: "back.out(2)" });

    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div ref={viewRef} className="relative w-full h-full z-0">
      <div
        data-articles-scroll-container="1"
        className="relative z-120 bg-base-cream dark:bg-base-blue-light p-8 overflow-y-auto overflow-x-hidden custom-scrollbar"
      >
        <div className="min-h-full flex flex-col">
          <div className="fade-in-element sticky top-0 z-30 -mx-8 mb-6 px-8 pt-6 pb-4">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={onClose}
                onMouseEnter={handleBackHover}
                onMouseLeave={handleBackLeave}
                className="flex items-center gap-2 text-base-blue dark:text-base-blue-dark hover:dark:text-base-blue-dark/80 hover:text-base-blue/80 font-bold cursor-pointer transition-colors"
              >
                <IoArrowBackOutline className="transition-none" /> Back to
                articles
              </button>

              <div className="flex items-center gap-2">
                {/* 🌟 copy button */}
                <button
                  type="button"
                  onClick={onCopyClick}
                  onMouseEnter={handleCopyHover}
                  onMouseLeave={handleCopyLeave}
                  className="flex items-center gap-2 rounded-xl border-4 border-base-blue/60 dark:border-base-blue-dark/60 bg-white/60 dark:bg-white/5 px-4 py-2 font-black text-base-brwan hover:scale-[1.02] transition-transform overflow-hidden"
                >
                  <div className="icon-wrapper relative w-5 h-5 flex items-center justify-center">
                    <IoCopyOutline
                      className="copy-icon absolute transition-none"
                      size={20}
                    />
                    <IoCheckmark
                      className="check-icon absolute opacity-0 scale-0 transition-none"
                      color="#10b981"
                      size={24}
                    />
                  </div>
                  {/* min-h prevents the button from jittering when the text changes*/}
                  <span className="copy-text inline-block min-w-17.5 text-left">
                    Copy link
                  </span>
                </button>

                {/* 🌟 Save Button */}
                <button
                  type="button"
                  onClick={onSaveClick}
                  onMouseEnter={handleSaveHover}
                  onMouseLeave={handleSaveLeave}
                  className="flex items-center gap-2 rounded-xl border-4 border-base-blue/60 dark:border-base-blue-dark/60 bg-white/60 dark:bg-white/5 px-4 py-2 font-black text-base-brwan hover:scale-[1.02] transition-transform overflow-hidden"
                >
                  <div
                    ref={saveIconWrapperRef}
                    className="icon-wrapper relative w-5 h-5 flex items-center justify-center"
                  >
                    <IoBookmarkOutline
                      className="save-outline absolute transition-none"
                      size={20}
                    />
                    <IoBookmark
                      className="save-solid absolute opacity-0 scale-0 transition-none text-base-blue"
                      size={20}
                    />
                  </div>
                  <span
                    ref={saveTextRef}
                    className="inline-block min-w-12.5 text-left"
                  >
                    Save
                  </span>
                </button>

                {/* 🌟 Theme Toggle Button */}
                {mounted && (
                  <button
                    type="button"
                    onClick={onThemeClick}
                    onMouseEnter={handleThemeHover}
                    onMouseLeave={handleThemeLeave}
                    className="flex items-center rounded-xl border-4 border-base-blue/60 dark:border-base-blue-dark/60 bg-white/60 dark:bg-white/5 px-2 py-2 font-black text-base-brwan hover:scale-[1.02] transition-transform"
                    aria-label="Toggle theme"
                  >
                    <div
                      ref={themeIconWrapperRef}
                      className="icon-wrapper relative w-6 h-6 flex items-center justify-center"
                    >
                      <IoMoonOutline
                        className="theme-moon absolute transition-none"
                        size={24}
                      />
                      <IoSunnyOutline
                        className="theme-sun absolute opacity-0 scale-0 transition-none"
                        size={24}
                      />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {article.image && (
            <div
              data-flip-id={`img-${article.id}`}
              className="w-full h-64 mb-6 rounded-2xl overflow-hidden relative flip-element origin-top-left will-change-transform"
            >
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                style={{
                  objectPosition: article.imageObjectPosition ?? "center",
                }}
              />
            </div>
          )}

          <div className="mb-5">
            <h2
              data-flip-id={`title-${article.id}`}
              className="text-3xl font-black font-serif text-base-blue dark:text-base-blue-dark flip-element origin-top-left will-change-transform"
            >
              {article.title}
            </h2>

            <div className="fade-in-element mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-black leading-relaxed">
              <p
                data-flip-id={`date-${article.id}`}
                className="text-base-brwan flip-element origin-top-left will-change-transform"
              >
                {article.date}
              </p>

              <p className="text-base-brwan/70">
                <span>Filed under </span>
                <span className="inline-flex items-center px-2 py-0.5 text-base-brwan">
                  {article.category}
                </span>
                <span>.</span>
              </p>

              <p className="text-base-brwan/70">
                <span>Last updated on </span>
                <span className="font-mono font-black tracking-wide">
                  {article.updatedAt}
                </span>
                <span>.</span>
              </p>
            </div>
          </div>

          <div className="fade-in-element">
            <ArticleMdxContent articleId={article.id} Content={Content} />
          </div>

          <div className="fade-in-element mt-10">
            <h3 className="text-xl font-black mb-3 text-base-brwan">
              Suggested articles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggested.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenArticle(item.id)}
                  className="text-left rounded-2xl border-4 border-base-blue/20 bg-white/50 dark:bg-white/5 p-4 hover:scale-[1.01] transition-transform"
                >
                  <p className="font-black text-base-brwan"> {item.title} </p>
                  <p className="text-xs font-black uppercase tracking-wider text-base-brwan/60 mt-1">
                    {item.date}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="fade-in-element mt-auto pt-10">
            <div className="pt-4 pb-3 backdrop-blur-sm border-t-4 border-dashed border-base-blue/40 dark:border-base-blue-dark/60">
              <div className="flex items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-wider text-base-brwan/80">
                    Last update
                  </p>
                  <p className="font-mono text-base font-black tracking-wide text-base-brwan">
                    {article.updatedAt}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-black uppercase tracking-wider text-base-brwan">
                    Views
                  </span>
                  <div className="shrink-0 rounded-md bg-black/85 border-4 border-base-blue dark:border-base-blue-dark px-2 py-1 shadow-inner min-w-28 text-center">
                    <p className="font-digital text-2xl font-black text-base-cream tracking-widest leading-none translate-x-1">
                      {retroViews}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <NewsletterSubscribe className="mt-4 p-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
