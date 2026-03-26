"use client";

import Image from "next/image";
import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RetroImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  layout?: "responsive" | "intrinsic" | "fixed" | "fill";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  className?: string;
  caption?: ReactNode;
}

export default function RetroImage({
  src,
  alt,
  width = 800,
  height = 600,
  layout = "responsive",
  objectFit = "cover",
  className = "",
  caption,
}: RetroImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const scrollContainer = containerRef.current.closest(
        '[data-articles-scroll-container="1"]',
      );

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 1.05, filter: "blur(10px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
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
    <div ref={containerRef} className={`my-8 ${className}`}>
      <div className="overflow-hidden rounded-lg shadow-xl border-2 border-base-blue/20 dark:border-base-blue-dark/30">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          layout={layout}
          objectFit={objectFit}
          className="rounded-lg"
        />
      </div>
      {caption && (
        <figcaption className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400 font-mono">
          {caption}
        </figcaption>
      )}
    </div>
  );
}
