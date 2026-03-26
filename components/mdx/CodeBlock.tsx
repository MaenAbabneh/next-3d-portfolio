"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: string | string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : undefined;

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const scrollContainer = containerRef.current.closest(
        '[data-articles-scroll-container="1"]',
      );

      gsap.fromTo(
        containerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            scroller: scrollContainer,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="my-6 bg-base-dark-BG rounded-2xl overflow-hidden shadow-md"
    >
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          background: "transparent",
          fontSize: "1em",
          margin: 0,
          padding: "1.2em",
        }}
        showLineNumbers
      >
        {typeof children === "string"
          ? children.trim()
          : Array.isArray(children)
            ? children.join("")
            : (children ?? "")}
      </SyntaxHighlighter>
    </div>
  );
}
