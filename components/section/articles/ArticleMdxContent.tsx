"use client";

import { slugifyHeading } from "@/utils/slugifyHeading";
import { MDXProvider } from "@mdx-js/react";
import { useMemo, type AnchorHTMLAttributes, type HTMLAttributes } from "react";

type ArticleMdxContentProps = {
  articleId: number;
  Content: React.ComponentType;
};

export default function ArticleMdxContent({
  articleId,
  Content,
}: ArticleMdxContentProps) {
  const mdxComponents = useMemo(
    () => ({
      h2: (props: HTMLAttributes<HTMLHeadingElement>) => {
        const rawText =
          typeof props.children === "string" ? props.children : null;
        const slug = slugifyHeading(rawText);
        const id = slug ? `article-${articleId}-${slug}` : undefined;

        return (
          <h3
            {...props}
            id={id}
            data-article-heading={id}
            className="text-2xl font-black mt-8 mb-3 font-serif text-base-brwan"
          />
        );
      },
      h3: (props: HTMLAttributes<HTMLHeadingElement>) => {
        const rawText =
          typeof props.children === "string" ? props.children : null;
        const slug = slugifyHeading(rawText);
        const id = slug ? `article-${articleId}-${slug}` : undefined;

        return (
          <h4
            {...props}
            id={id}
            data-article-heading={id}
            className="text-xl font-black mt-6 mb-2 text-base-brwan"
          />
        );
      },
      p: (props: HTMLAttributes<HTMLParagraphElement>) => (
        <p {...props} className="leading-loose text-lg text-base-brwan" />
      ),
      ul: (props: HTMLAttributes<HTMLUListElement>) => (
        <ul
          {...props}
          className="list-disc ps-6 space-y-2 leading-loose text-lg text-base-brwan"
        />
      ),
      ol: (props: HTMLAttributes<HTMLOListElement>) => (
        <ol
          {...props}
          className="list-decimal ps-6 space-y-2 leading-loose text-lg text-base-brwan"
        />
      ),
      blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
          {...props}
          className="border-s-4 border-base-blue/20 dark:border-base-blue-dark/20 ps-4 italic opacity-90"
        />
      ),
      a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a
          {...props}
          className="font-black underline text-base-blue hover:text-base-blue/80 transition-colors"
          rel={props.rel ?? "noreferrer"}
          target={props.target ?? "_blank"}
        />
      ),
      pre: (props: HTMLAttributes<HTMLPreElement>) => (
        <pre
          {...props}
          className="rounded-2xl border-4 border-base-blue/20 dark:border-base-blue-dark/20 bg-white/60 dark:bg-white/5 p-4 overflow-x-auto"
        />
      ),
      code: (props: HTMLAttributes<HTMLElement>) => (
        <code
          {...props}
          className="font-mono font-black text-sm px-2 py-1 rounded-md bg-base-blue/10 text-base-blue dark:text-base-blue-dark"
        />
      ),
    }),
    [articleId],
  );

  return (
    <MDXProvider components={mdxComponents}>
      <div className="space-y-5">
        <Content />
      </div>
    </MDXProvider>
  );
}
