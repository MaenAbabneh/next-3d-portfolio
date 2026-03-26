"use client";

import { IoConstructOutline } from "react-icons/io5";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Example({
  children,
  title = "Scenario Builder",
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
        { opacity: 0, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
        {
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 0.8,
          ease: "power2.inOut",
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
    <div ref={containerRef} className="my-8 relative">
      <div className="absolute -top-4 left-4 bg-base-blue text-white px-3 py-1 font-mono font-black text-xs uppercase tracking-widest rounded-md border-2 border-base-blue-dark shadow-sm z-10">
        {title}
      </div>
      <div className="rounded-xl border-4 border-dashed border-base-blue/40 bg-white/50 dark:bg-base-blue-light/5 p-6 pt-10">
        <div className="flex items-center gap-3 mb-4 text-base-blue-dark">
          <IoConstructOutline size={26} />
          <p className="font-sans font-black text-lg">Building the Scenario</p>
        </div>
        <div className="text-base-brwan font-medium space-y-3 text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
