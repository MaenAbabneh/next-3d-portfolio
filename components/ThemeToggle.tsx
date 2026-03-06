"use client";

import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState, useRef } from "react";
import { MoonIcon } from "./Icons/MoonIcon";
import { SunIcon } from "./Icons/SunIcon";
import { useRipple } from "@/hooks/animations/useRipple";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);

  const hasInitialized = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isDark = resolvedTheme === "dark";

  const { registerClick } = useRipple({
    containerRef,
    rippleRef,
    isDark,
    colors: {
      darkBg: "var(--color-base-blue)",
      lightBg: "var(--color-base-cream)",
      darkBorder: "var(--color-base-blue-dark)",
      lightBorder: "var(--color-base-yellow)",
    },
  });

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    registerClick(e); // 1. نسجل مكان الضغطة للهوك
    setTheme(isDark ? "light" : "dark"); // 2. نغير الثيم
  };

  useGSAP(() => {
    if (!mounted) return;

    const container = containerRef.current;
    const ripple = rippleRef.current;
    const sun = sunRef.current;
    const moon = moonRef.current;

    if (!container || !sun || !moon || !ripple) return;

    const isDark = resolvedTheme === "dark";

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
      gsap.set(ripple, { opacity: 0 }); // إخفاء الدائرة
      hasInitialized.current = true;
      return;
    }
    const tl = gsap.timeline();

    tl.to(
      sun,
      {
        y: isDark ? 40 : 0,
        opacity: isDark ? 0 : 1,
        scale: isDark ? 0.5 : 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "<",
    );

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
      ref={containerRef}
      onClick={handleToggle}
      className="relative overflow-hidden w-16 h-16 bg-base-cream border-base-yellow dark:bg-base-blue dark:border-base-blue-dark rounded-2xl border-4 flex items-center justify-center cursor-pointer shadow-lg"
    >
      <span
        ref={rippleRef}
        className="absolute w-4 h-4 rounded-full pointer-events-none z-0 block"
      />
      {/* ☀️ حاوية الشمس */}
      <div
        ref={sunRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <SunIcon className="w-9 h-9 text-base-yellow" />
      </div>

      {/* 🌙 حاوية القمر */}
      <div
        ref={moonRef}
        className="absolute inset-0 flex items-center justify-center "
      >
        <MoonIcon
          className="w-9 h-9 text-base-blue-dark"
          bodyColor="text-base-blue-dark"
        />
      </div>
    </button>
  );
}
