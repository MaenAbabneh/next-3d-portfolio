"use client";

import { slugifyHeading } from "@/utils/slugifyHeading";
import { MDXProvider } from "@mdx-js/react";
import React, {
  useMemo,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
} from "react";
import Tip from "@/components/mdx/Tip";
import Note from "@/components/mdx/Note";
import Example from "@/components/mdx/Example";
import CodeBlock from "@/components/mdx/CodeBlock";
import QuizCard from "@/components/mdx/QuizCard";
import PullQuote from "@/components/mdx/PullQuote";
import ResourceLink from "@/components/mdx/ResourceLink";
import StatsTable from "@/components/mdx/StatsTable";
import RetroImage from "@/components/mdx/RetroImage";
import RetroVideo from "@/components/mdx/RetroVideo";

type CalloutKind = "tip" | "note" | "warning" | "info";

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

function detectCalloutKind(
  rawText: string,
): { kind: CalloutKind; stripRe: RegExp } | null {
  const text = rawText.trim();
  if (!text) return null;

  const patterns: Array<{ kind: CalloutKind; re: RegExp }> = [
    {
      kind: "tip",
      re: /^(\[!TIP\]|tip\s*:|tips\s*:|نصيحة\s*:|تلميح\s*:|💡)\s*/i,
    },
    { kind: "note", re: /^(\[!NOTE\]|note\s*:|ملاحظة\s*:|📝)\s*/i },
    {
      kind: "warning",
      re: /^(\[!WARNING\]|\[!CAUTION\]|warning\s*:|caution\s*:|تحذير\s*:|⚠️)\s*/i,
    },
    { kind: "info", re: /^(\[!INFO\]|info\s*:|معلومة\s*:|ℹ️)\s*/i },
  ];

  for (const { kind, re } of patterns) {
    if (re.test(text)) return { kind, stripRe: re };
  }

  return null;
}

function calloutTitle(kind: CalloutKind) {
  switch (kind) {
    case "tip":
      return "نصيحة";
    case "note":
      return "ملاحظة";
    case "warning":
      return "تحذير";
    case "info":
      return "معلومة";
  }
}

function calloutClasses(kind: CalloutKind) {
  switch (kind) {
    case "tip":
      return "border-base-blue/40 bg-base-blue/10 dark:border-base-blue-dark/40 dark:bg-white/5";
    case "note":
      return "border-base-blue/25 bg-white/60 dark:border-base-blue-dark/25 dark:bg-white/5";
    case "warning":
      return "border-base-blue-dark/45 bg-base-blue-dark/10 dark:border-base-blue/35 dark:bg-white/5 border-dashed";
    case "info":
      return "border-base-blue/30 bg-base-blue-light/30 dark:border-base-blue-dark/30 dark:bg-white/5";
  }
}

function stripCalloutPrefixFromChildren(
  children: React.ReactNode,
  stripRe: RegExp,
): React.ReactNode {
  if (children == null) return children;
  const allChildren = Array.isArray(children) ? children : [children];

  const stripped = allChildren.map((child, index) => {
    if (!React.isValidElement(child)) return child;

    const element = child as React.ReactElement<{ children?: React.ReactNode }>;
    const isParagraph = element.type === "p";
    if (!isParagraph || index !== 0) return child;

    const pChildren = element.props.children;

    if (typeof pChildren === "string") {
      const nextText = pChildren.replace(stripRe, "").trimStart();
      if (!nextText) return null;
      return React.cloneElement(element, { children: nextText });
    }

    if (
      Array.isArray(pChildren) &&
      pChildren.length > 0 &&
      typeof pChildren[0] === "string"
    ) {
      const first = (pChildren[0] as string).replace(stripRe, "");
      const nextChildren = [first.trimStart(), ...pChildren.slice(1)];
      const text = getText(nextChildren).trim();
      if (!text) return null;
      return React.cloneElement(element, { children: nextChildren });
    }

    return child;
  });

  const compact = stripped.filter((n) => n != null);
  return compact.length === 1 ? compact[0] : compact;
}

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
        const rawText = getText(props.children).trim();
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
        const rawText = getText(props.children).trim();
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
      blockquote: (props: HTMLAttributes<HTMLQuoteElement>) =>
        (() => {
          const raw = getText(props.children);
          const match = detectCalloutKind(raw);

          if (!match) {
            return (
              <blockquote
                {...props}
                className="border-s-4 border-base-blue/20 dark:border-base-blue-dark/20 ps-4 italic opacity-90"
              />
            );
          }

          const nextChildren = stripCalloutPrefixFromChildren(
            props.children,
            match.stripRe,
          );

          return (
            <blockquote
              {...props}
              className={`rounded-2xl border-4 px-5 py-4 not-italic ${calloutClasses(match.kind)}`}
            >
              <p className="m-0 mb-2 text-xs font-black uppercase tracking-wider text-base-blue dark:text-base-blue-dark">
                {calloutTitle(match.kind)}
              </p>
              {nextChildren}
            </blockquote>
          );
        })(),
      a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a
          {...props}
          className="font-black underline text-base-blue hover:text-base-blue/80 transition-colors"
          rel={props.rel ?? "noreferrer"}
          target={props.target ?? "_blank"}
        />
      ),
      pre: (props: HTMLAttributes<HTMLPreElement>) => <pre {...props} />,
      code: (props: { className?: string; children: string | string[] }) => (
        <CodeBlock {...props} />
      ),
      Tip,
      Note,
      Example,
      QuizCard,
      PullQuote,
      ResourceLink,
      StatsTable,
      RetroImage,
      RetroVideo,
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
