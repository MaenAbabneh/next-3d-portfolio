"use client";

import Link from "next/link";
import { IoLinkOutline, IoArrowForward } from "react-icons/io5";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ResourceLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description?: string;
}) {
  const containerRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const scrollContainer = containerRef.current.closest(
        '[data-articles-scroll-container="1"]',
      );

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
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
    <Link
      ref={containerRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block my-6"
    >
      <div className="relative flex items-center justify-between p-5 bg-white dark:bg-base-dark-BG rounded-xl border-4 border-base-brwan/20 hover:border-base-blue transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] group-hover:shadow-[6px_6px_0px_0px_rgba(41,82,155,0.4)] group-hover:-translate-y-1">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 size-5 bg-white dark:bg-base-dark-BG border-r-4 border-base-brwan/20 group-hover:border-base-blue rounded-full"></div>
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 size-5 bg-white dark:bg-base-dark-BG border-l-4 border-base-brwan/20 group-hover:border-base-blue rounded-full"></div>

        <div className="flex items-center gap-4 z-10">
          <div className="bg-base-blue/10 p-3 rounded-lg text-base-blue">
            <IoLinkOutline
              size={24}
              className="group-hover:rotate-45 transition-transform"
            />
          </div>
          <div>
            <h4 className="font-black font-sans text-lg text-base-brwan group-hover:text-base-blue transition-colors">
              {title}
            </h4>
            {description && (
              <p className="text-xs font-mono text-base-brwan/70 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        <IoArrowForward
          size={20}
          className="text-base-brwan/40 group-hover:text-base-blue group-hover:translate-x-1 transition-all z-10"
        />
      </div>
    </Link>
  );
}
