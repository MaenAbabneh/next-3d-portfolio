import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { ARTICLES_CONTENT } from "@/constant/articlesContent";
import ArticleMarkdownContent from "@/components/section/articles/ArticleMarkdownContent";

function getArticleById(id: number) {
  return ARTICLES_CONTENT.find((a) => a.id === id) ?? null;
}

export async function generateStaticParams() {
  return ARTICLES_CONTENT.map((article) => ({ id: String(article.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) return {};

  const article = getArticleById(articleId);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: article.image
      ? {
          title: article.title,
          description: article.excerpt,
          images: [{ url: article.image }],
        }
      : undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articleId = Number(id);
  if (!Number.isFinite(articleId)) notFound();

  const article = getArticleById(articleId);
  if (!article) notFound();

  return (
    <main className="min-h-screen bg-base-cream dark:bg-base-blue-light text-base-brwan dark:text-base-cream">
      <div className="mx-auto w-full max-w-225 px-6 py-10">
        <div className="rounded-2xl border-4 border-base-blue/20 bg-white/80 dark:bg-base-blue-light/20 p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/?article=${article.id}`}
              className="text-base-blue hover:text-base-blue/80 font-black transition-colors"
            >
              Back to room
            </Link>

            <span className="text-xs font-black uppercase tracking-wider text-base-brwan/70 dark:text-base-cream/70">
              Article #{article.id}
            </span>
          </div>

          {article.image && (
            <div className="mt-6 w-full h-64 rounded-2xl overflow-hidden relative">
              <Image
                src={article.image}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 900px, 900px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <header className="mt-6">
            <h1 className="text-3xl md:text-4xl font-black font-serif">
              {article.title}
            </h1>

            <div className="mt-3 text-sm font-black text-base-brwan/70 dark:text-base-cream/70 leading-relaxed">
              <span>Filed under </span>
              <span className="inline-flex items-center rounded-md border-2 border-base-blue/30 bg-white/60 dark:bg-white/5 px-2 py-0.5">
                {article.category}
              </span>
              <span> on </span>
              <span className="font-mono font-black tracking-wide">
                {article.date}
              </span>
              <span>.</span>
            </div>

            <div className="mt-1 text-sm font-black text-base-brwan/70 dark:text-base-cream/70 leading-relaxed">
              <span>Last updated on </span>
              <span className="font-mono font-black tracking-wide">
                {article.updatedAt}
              </span>
              <span>.</span>
            </div>
          </header>

          <div className="mt-8">
            <ArticleMarkdownContent
              articleId={article.id}
              markdown={article.contentSource}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
