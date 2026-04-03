import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ArticleMarkdownContent from "@/components/section/articles/ArticleMarkdownContent";
import { ARTICLES_CONTENT } from "@/constant/articlesContent";
import { getArticleSlug } from "@/utils/articleSlug";

type Params = Promise<{ id: string }>;

function resolveArticleParam(raw: string) {
  const byNumber = Number(raw);

  if (Number.isFinite(byNumber)) {
    return ARTICLES_CONTENT.find((article) => article.id === byNumber) ?? null;
  }

  return (
    ARTICLES_CONTENT.find((article) => getArticleSlug(article) === raw) ?? null
  );
}

export function generateStaticParams() {
  return ARTICLES_CONTENT.map((article) => ({
    id: getArticleSlug(article),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const article = resolveArticleParam(id);

  if (!article) {
    return {
      title: "Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const slug = getArticleSlug(article);
  const englishDescription = `${article.excerpt} Read this article by Maen Ababneh about ${article.title} and modern web development.`;
  const arabicDescription = `اقرأ هذا المقال من معن عبابنة حول ${article.title} وتطوير الويب الحديث باستخدام Next.js وReact وGSAP.`;
  const bilingualDescription = `${englishDescription} | ${arabicDescription}`;

  return {
    title: `${article.title} | Maen Ababneh | معن عبابنة`,
    description: bilingualDescription,
    authors: [{ name: "Maen Ababneh" }, { name: "معن عبابنة" }],
    creator: "Maen Ababneh | معن عبابنة",
    alternates: {
      canonical: `/articles/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: bilingualDescription,
      type: "article",
      url: `/articles/${slug}`,
      authors: ["Maen Ababneh", "معن عبابنة"],
      publishedTime: article.date,
      modifiedTime: article.updatedAt,
      images: article.image ? [{ url: article.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: bilingualDescription,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { id } = await params;
  const article = resolveArticleParam(id);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-base-cream dark:bg-base-blue-light text-base-brwan">
      <article className="mx-auto w-full max-w-4xl px-5 py-12 md:px-8 md:py-16">
        <header className="mb-10 border-b-4 border-base-blue/20 pb-6 dark:border-base-blue-dark/20">
          <p className="font-mono text-xs uppercase tracking-wide opacity-70 mb-2">
            {article.category}
          </p>
          <h1 className="font-serif font-black text-3xl md:text-5xl leading-tight">
            {article.title}
          </h1>
          <p className="mt-4 text-sm opacity-75 font-mono">
            Published: {article.date} | Updated: {article.updatedAt}
          </p>
          <p className="mt-4 text-base md:text-lg max-w-3xl">
            {article.excerpt}
          </p>
        </header>

        <ArticleMarkdownContent
          articleId={article.id}
          markdown={article.contentSource}
        />

        <footer className="mt-12 pt-6 border-t-4 border-base-blue/20 dark:border-base-blue-dark/20">
          <Link
            href="/"
            className="font-bold underline decoration-2 underline-offset-4"
          >
            Back to portfolio
          </Link>
        </footer>
      </article>
    </main>
  );
}
