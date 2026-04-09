import type { ArticleBase } from "@/constant/articlesContent";

export const SITE_URL = "https://maenababneh.com";
export const SITE_NAME = "Maen Ababneh Portfolio";
export const AUTHOR_NAME = "Maen Ababneh";
export const AUTHOR_NAME_AR = "معن عبابنة";

type JsonLdValue = Record<string, unknown>;

function escapeJsonLd(value: string) {
  return value.replace(/</g, "\\u003c");
}

export function toJsonLdScript(value: JsonLdValue) {
  return escapeJsonLd(JSON.stringify(value));
}

export function buildSiteJsonLd(): JsonLdValue {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: [AUTHOR_NAME, AUTHOR_NAME_AR],
        inLanguage: ["en", "ar"],
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        alternateName: AUTHOR_NAME_AR,
        url: SITE_URL,
        jobTitle: "Full-Stack Web Developer",
        knowsAbout: ["Next.js", "React", "GSAP", "Three.js", "Web Performance"],
      },
    ],
  };
}

function wordCount(text: string) {
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

function readingTimeMinutes(text: string) {
  return Math.max(1, Math.ceil(wordCount(text) / 200));
}

export function buildArticleJsonLd(
  article: ArticleBase,
  canonicalUrl: string,
): JsonLdValue {
  const articleImage = article.image
    ? {
        "@type": "ImageObject",
        url: article.image,
        caption: article.imageAlt,
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: canonicalUrl,
    headline: article.title,
    description: article.excerpt,
    image: articleImage ? [articleImage] : undefined,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: AUTHOR_NAME,
      alternateName: AUTHOR_NAME_AR,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    datePublished: article.date,
    dateModified: article.updatedAt,
    wordCount: wordCount(article.contentSource),
    timeRequired: `PT${readingTimeMinutes(article.contentSource)}M`,
    url: canonicalUrl,
  };
}
