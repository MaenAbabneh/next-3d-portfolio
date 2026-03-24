"use client";

import { useRef } from "react";
import { IoNewspaperSharp } from "react-icons/io5"; // أيقونة المقالات
import { useTheme } from "next-themes";
import { useUISound } from "@/hooks/audio/useUISound";
import { useRipple } from "@/hooks/animations/useRipple";
import { useOverlayStore } from "@/store/useOverlayStore";

export function ArticlesButton() {
  const containerRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  const { theme, resolvedTheme } = useTheme();
  const { playClick, playHover } = useUISound();
  const { openOverlay } = useOverlayStore(); // استدعاء دالة فتح الأوفرلاي

  const isDark = (resolvedTheme ?? theme) === "dark";

  const { registerClick } = useRipple({
    containerRef,
    rippleRef,
    isDark,
    borderWidth: 4,
    colors: {
      darkBg: "var(--color-base-blue-light)",
      lightBg: "var(--color-base-cream)",
      darkBorder: "var(--color-base-blue-dark)",
      lightBorder: "var(--color-base-blue)",
    },
  });

  const handleOpen = (e: React.MouseEvent) => {
    registerClick(e);
    playClick();
    openOverlay("articles"); // فتح قسم المقالات
  };

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={handleOpen}
      onMouseEnter={playHover}
      aria-label="Open Articles"
      className="relative box-border w-16 h-16 rounded-2xl border-4 flex items-center justify-center cursor-pointer shadow-lg bg-base-cream border-base-blue dark:bg-base-blue-light dark:border-base-blue-dark hover:scale-105 transition-transform z-50 group"
    >
      <div
        ref={rippleRef}
        className="absolute -inset-1 rounded-2xl border-4 z-0 pointer-events-none hidden"
      />
      {/* الأيقونة تدور قليلاً عند التحويم */}
      <IoNewspaperSharp className="w-8 h-8 text-base-blue dark:text-base-blue-dark transition-transform duration-500 group-hover:-rotate-12 z-10 relative" />
    </button>
  );
}
