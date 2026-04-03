"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type ArticleLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

const EXTERNAL_HREF_RE = /^(https?:\/\/|mailto:|tel:)/i;

export default function ArticleLink({
  href,
  children,
  className,
  target,
  rel,
}: ArticleLinkProps) {
  const isExternal = EXTERNAL_HREF_RE.test(href);

  return (
    <Link
      href={href}
      target={target ?? (isExternal ? "_blank" : undefined)}
      rel={rel ?? (isExternal ? "noreferrer" : undefined)}
      className={
        className ??
        "font-black underline text-base-blue hover:text-base-blue/80 transition-colors"
      }
    >
      {children}
    </Link>
  );
}
