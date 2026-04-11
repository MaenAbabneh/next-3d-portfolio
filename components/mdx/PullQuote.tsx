"use client";

import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PullQuote({
  children,
  author,
}: {
  children: React.ReactNode;
  author?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const scrollContainer = containerRef.current.closest(
        '[data-articles-scroll-container="1"]',
      );

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30, rotationX: -45 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
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
      className="my-10 relative pl-8 md:pl-12"
      style={{ perspective: "1000px" }}
    >
      <IoChatbubbleEllipsesOutline
        size={60}
        className="absolute -top-4 -left-2 text-base-blue/20 dark:text-base-blue-dark/30 -z-10 rotate-12"
      />
      <blockquote className="border-l-8 border-base-blue dark:border-base-blue-dark pl-6 py-2">
        <div className="font-serif font-black text-2xl md:text-3xl leading-tight text-base-brwan tracking-tighter [&_p]:m-0 [&_p]:font-inherit [&_p]:text-inherit [&_p]:leading-inherit [&_p]:tracking-inherit">
          <span aria-hidden="true">&quot;</span>
          {children}
          <span aria-hidden="true">&quot;</span>
        </div>
        {author && (
          <footer className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-base-blue">
            — {author}
          </footer>
        )}
      </blockquote>
    </div>
  );
}
