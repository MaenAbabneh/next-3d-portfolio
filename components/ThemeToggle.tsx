"use client";

import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState, useRef } from "react";
import { MoonIcon } from "./Icons/MoonIcon";
import { SunIcon } from "./Icons/SunIcon";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLButtonElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useGSAP(() => {
    if (!mounted) return;

    const container = containerRef.current;
    const sun = sunRef.current;
    const moon = moonRef.current;
    if (!container || !sun || !moon) return;

    const isDark = resolvedTheme === "dark";

    const rootStyles = getComputedStyle(document.documentElement);
    const cssVar = (name: string) => rootStyles.getPropertyValue(name).trim();
    const backgroundColor = isDark
      ? cssVar("--color-base-blue")
      : cssVar("--color-base-cream");
    const borderColor = isDark
      ? cssVar("--color-base-blue-dark")
      : cssVar("--color-base-yellow");

    const sunState = {
      y: isDark ? 40 : 0,
      opacity: isDark ? 0 : 1,
      scale: isDark ? 0.5 : 1,
    };
    const moonState = {
      y: isDark ? 0 : -40,
      opacity: isDark ? 1 : 0,
      scale: isDark ? 1 : 0.5,
    };

    if (!hasInitialized.current) {
      gsap.set(container, { backgroundColor, borderColor });
      gsap.set(sun, sunState);
      gsap.set(moon, moonState);
      hasInitialized.current = true;
      return;
    }

    // 1. تحريك ألوان الزر (الخلفية والحدود) بنعومة
    gsap.to(container, {
      backgroundColor,
      borderColor,
      duration: 0.5,
      ease: "power2.inOut",
    });

    // 2. تحريك الشمس (خروج/دخول)
    gsap.to(sun, {
      ...sunState,
      duration: 0.5,
      ease: "back.out(1.7)",
    });

    // 3. تحريك القمر (دخول/خروج)
    gsap.to(moon, {
      ...moonState,
      duration: 0.5,
      ease: "back.out(1.7)",
    });
  }, [resolvedTheme, mounted]);

  if (!mounted) return null;

  return (
    <button
      ref={containerRef}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative overflow-hidden w-16 h-16 rounded-2xl border-[4px] flex items-center justify-center cursor-pointer shadow-lg"
    >
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
