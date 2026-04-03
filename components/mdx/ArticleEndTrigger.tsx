"use client";

import { useEffect, useRef } from "react";
import { useSupportStore } from "@/store/useSupportStore";

export default function ArticleEndTrigger() {
  const markerRef = useRef<HTMLDivElement>(null);
  const openOverlay = useSupportStore((s) => s.openOverlay);

  useEffect(() => {
    if (!markerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // 🌟 نمرر true لنجبر النافذة على الظهور في نهاية المقال
          openOverlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(markerRef.current);

    return () => observer.disconnect();
  }, [openOverlay]);

  return (
    <div ref={markerRef} className="h-2 w-full mt-10" aria-hidden="true" />
  );
}
