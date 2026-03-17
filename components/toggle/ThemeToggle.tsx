"use client";

import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState, useRef } from "react";
import { BsMoonStarsFill } from "react-icons/bs";
import { TbSunset2Filled } from "react-icons/tb";
import { useRipple } from "@/hooks/animations/useRipple";
import { useUISound } from "@/hooks/audio/useUISound";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);

  const hasInitialized = useRef(false);

  const { playHover, playClick } = useUISound();

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isDark = resolvedTheme === "dark";

  const { registerClick } = useRipple({
    containerRef,
    rippleRef,
    isDark,
    borderWidth: 4, // يجب أن يطابق البوردر في CSS
    colors: {
      darkBg: "var(--color-base-blue-light)",
      lightBg: "var(--color-base-cream)",
      darkBorder: "var(--color-base-blue-dark)",
      lightBorder: "var(--color-base-blue)",
    },
  });

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick();
    registerClick(e);
    setTheme(isDark ? "light" : "dark");
  };

  useGSAP(() => {
    if (!mounted) return;

    const sun = sunRef.current;
    const moon = moonRef.current;

    if (!sun || !moon) return;

    // الإعداد الأولي للأيقونات
    if (!hasInitialized.current) {
      gsap.set(sun, {
        y: isDark ? 40 : 0,
        opacity: isDark ? 0 : 1,
        scale: isDark ? 0.5 : 1,
      });
      gsap.set(moon, {
        y: isDark ? 0 : -40,
        opacity: isDark ? 1 : 0,
        scale: isDark ? 1 : 0.5,
      });
      hasInitialized.current = true;
      return;
    }

    // الأنيميشن عند التبديل
    const tl = gsap.timeline();

    tl.to(sun, {
      y: isDark ? 40 : 0,
      opacity: isDark ? 0 : 1,
      scale: isDark ? 0.5 : 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    });

    tl.to(
      moon,
      {
        y: isDark ? 0 : -40,
        opacity: isDark ? 1 : 0,
        scale: isDark ? 1 : 0.5,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "<",
    );
  }, [resolvedTheme, mounted]);

  if (!mounted) return null;

  return (
    <button
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      ref={containerRef}
      onMouseEnter={playHover}
      onClick={handleToggle}
      className="relative box-border w-16 h-16 rounded-2xl border-4 flex items-center justify-center cursor-pointer shadow-lg bg-base-cream border-base-blue dark:bg-base-blue-light dark:border-base-blue-dark"
    >
      <div
        ref={rippleRef}
        className="absolute -inset-1 rounded-2xl border-4 z-0 pointer-events-none hidden"
      />

      {/* ☀️ حاوية الشمس */}
      <div
        ref={sunRef}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <TbSunset2Filled className="w-9 h-9 text-base-blue dark:text-base-blue-dark" />
      </div>

      {/* 🌙 حاوية القمر */}
      <div
        ref={moonRef}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <BsMoonStarsFill className="w-7 h-7 text-base-blue dark:text-base-blue-dark" />
      </div>
    </button>
  );
}
