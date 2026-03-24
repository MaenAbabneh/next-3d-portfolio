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
