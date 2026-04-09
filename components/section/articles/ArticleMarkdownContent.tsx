import React from "react";
import ReactMarkdown from "react-markdown";

import { slugifyHeading } from "@/utils/slugifyHeading";

type ArticleMarkdownContentProps = {
  articleId: number;
  markdown: string;
};

function getText(node: React.ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getText).join("");
  if (React.isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return getText(element.props.children);
  }
  return "";
}

export default function ArticleMarkdownContent({
  articleId,
  markdown,
}: ArticleMarkdownContentProps) {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none prose-headings:font-black prose-headings:font-serif prose-p:font-bold prose-li:font-bold prose-blockquote:font-bold prose-code:font-mono prose-code:font-black prose-pre:bg-base-blue-dark/90 prose-pre:text-base-cream dark:prose-invert">
      <ReactMarkdown
        components={{
          img: ({ src, alt, title, ...props }) => {
            const resolvedAlt = alt ?? title ?? "";

            return (
              <figure className="my-8 overflow-hidden rounded-2xl border-4 border-base-blue/20 bg-white/60 shadow-lg dark:border-base-blue-dark/20 dark:bg-white/5">
                <img
                  {...props}
                  src={src}
                  alt={resolvedAlt}
                  title={title}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover"
                />
                {title ? (
                  <figcaption className="border-t-4 border-base-blue/10 px-4 py-3 text-sm font-mono text-base-brwan/70 dark:border-base-blue-dark/10">
                    {title}
                  </figcaption>
                ) : null}
              </figure>
            );
          },
          h2: ({ children, ...props }) => {
            const label = getText(children).trim();
            const slug = slugifyHeading(label) ?? "section";
            const id = `article-${articleId}-${slug}`;
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const label = getText(children).trim();
            const slug = slugifyHeading(label) ?? "section";
            const id = `article-${articleId}-${slug}`;
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
