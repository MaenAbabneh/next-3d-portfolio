"use client";

import Image from "next/image";
import type { Article } from "@/constant/articlesData";
import { ARTICLES_DATA } from "@/constant/articlesData";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import {
  IoArrowBackOutline,
  IoBookmark,
  IoBookmarkOutline,
} from "react-icons/io5";
import ArticleMdxContent from "./ArticleMdxContent";
import NewsletterSubscribe from "./NewsletterSubscribe";

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

  const Content = article.Content;
  const retroViews = displayViews.toString().padStart(6, "0");

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/articles/${article.id}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        return;
      }
    } catch {
      // fall through
    }
    try {
      const el = document.createElement("textarea");
      el.value = url;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    } catch {
      // ignore
    }
  };

  const suggested = ARTICLES_DATA.filter((a) => a.id !== article.id)
    .slice(0, 2)
    .map((a) => a);

  return (
    <div ref={viewRef} className="relative w-full h-full z-0">
      <div
        data-articles-scroll-container="1"
        className="relative z-120 bg-base-cream dark:bg-base-blue-light p-8 overflow-y-auto overflow-x-hidden custom-scrollbar"
      >
        <div className="min-h-full flex flex-col">
          {/* زر الرجوع والأزرار العلوية - تتلاشى للداخل */}
          <div className="fade-in-element sticky top-0 z-30 -mx-8 mb-6 px-8 pt-6 pb-4">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-base-blue dark:text-base-blue-dark hover:dark:text-base-blue-dark/80 hover:text-base-blue/80 font-bold cursor-pointer transition-colors"
              >
                <IoArrowBackOutline /> Back to articles
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 rounded-xl border-4 border-base-blue/60 dark:border-base-blue-dark/60 bg-white/60 dark:bg-white/5 px-4 py-2 font-black text-base-brwan hover:scale-[1.02] transition-transform"
                >
                  Copy link
                </button>

                <button
                  type="button"
                  onClick={() => onToggleBookmark(article.id)}
                  className="flex items-center gap-2 rounded-xl border-4 border-base-blue/60 dark:border-base-blue-dark/60 bg-white/60 dark:bg-white/5 px-4 py-2 font-black text-base-brwan hover:scale-[1.02] transition-transform"
                >
                  {isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />}
                  {isBookmarked ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>

          {/* 🚨 الصورة: تملك نفس معرّف البطاقة الخارجي للـ Flip */}
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
              />
            </div>
          )}

          <div className="mb-5">
            {/* 🚨 العنوان: يملك نفس معرّف البطاقة الخارجي للـ Flip */}
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
