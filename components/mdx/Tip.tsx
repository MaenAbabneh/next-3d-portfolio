"use client";

import { IoBulb } from "react-icons/io5";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Tip({
  children,
  title = "Quick tip",
}: {
  children: React.ReactNode;
  title?: string;
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
        { scale: 0.8, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
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
      className="my-6 rounded-2xl border-4 border-emerald-500/30 bg-emerald-500/10 p-5 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.3)]"
    >
      <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
        <IoBulb size={24} className="animate-pulse" />
        <span className="font-black font-serif text-lg">{title}</span>
      </div>
      <div className="text-base-brwan leading-relaxed text-sm font-medium">
        {children}
      </div>
    </div>
  );
}
