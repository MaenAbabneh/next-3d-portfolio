"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function RetroVideo({
  src,
  poster,
  title = "MEDIA_PLAYER",
}: {
  src: string;
  poster?: string;
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
        { scaleY: 0.05, opacity: 0, filter: "brightness(3)" },
        {
          scaleY: 1,
          opacity: 1,
          filter: "brightness(1)",
          duration: 0.6,
          ease: "power4.out",
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
    <div ref={containerRef} className="my-10 relative group origin-center">
      <div className="absolute -top-3 left-4 z-20 bg-base-blue text-white font-mono text-[10px] px-3 py-1 uppercase tracking-widest rounded-sm border-2 border-black dark:border-white shadow-sm">
        [ {title} ]
      </div>

      <div className="border-4 border-base-blue dark:border-base-blue-dark p-2 rounded-xl bg-black relative shadow-[4px_4px_0px_0px_rgba(41,82,155,0.3)]">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[100%_4px] z-30"></div>
        <video
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-auto rounded-lg relative z-20 pointer-events-none"
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      </div>
    </div>
  );
}
