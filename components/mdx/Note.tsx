"use client";

import { IoInformationCircle } from "react-icons/io5";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Note({
  children,
  title = "Note",
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
        { x: -50, opacity: 0, rotation: -2 },
        {
          x: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.5,
          ease: "power2.out",
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
    <div ref={containerRef} className="my-6 relative">
      <div className="absolute -top-3 -left-3 size-6 rounded-full border-4 border-dashed border-purple-500 bg-white/70 dark:bg-base-blue-dark/70"></div>
      <div className="rounded-xl border-4 border-purple-500/40 bg-purple-500/10 p-5 pt-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400">
          <IoInformationCircle size={22} />
          <span className="font-bold font-serif text-md">{title}</span>
        </div>
        <div className="text-base-brwan leading-relaxed font-mono text-xs">
          {children}
        </div>
      </div>
    </div>
  );
}
