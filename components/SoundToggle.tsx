"use client";

import { useSound } from "@/components/SoundProvider";
import { useTheme } from "next-themes";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { BiSolidVolumeMute, BiSolidVolumeFull } from "react-icons/bi";
import { useRipple } from "@/hooks/animations/useRipple";

export function SoundToggle() {
  const { muted, toggleMuted } = useSound();
  const { resolvedTheme } = useTheme();
  const mounted = typeof window !== "undefined";

  // Refs
  const containerRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const onIconRef = useRef<HTMLDivElement>(null);
  const offIconRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const isDark = resolvedTheme === "dark";

  const { registerClick } = useRipple({
    containerRef,
    rippleRef,
    isDark,
    borderWidth: 4,
    colors: {
      lightBg: "var(--color-base-cream)",
      lightBorder: "var(--color-base-yellow)",
      darkBg: "var(--color-base-blue)",
      darkBorder: "var(--color-base-blue-dark)",
    },
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    registerClick(e);
    toggleMuted();
  };

  // أنيميشن الأيقونات (تبديل بين السماعة والمكتوم)
  useGSAP(() => {
    if (!mounted || !onIconRef.current || !offIconRef.current) return;

    const onIcon = onIconRef.current;
    const offIcon = offIconRef.current;

    // الإعداد الأولي
    if (!hasInitialized.current) {
      gsap.set(onIcon, {
        y: muted ? 40 : 0,
        opacity: muted ? 0 : 1,
        scale: muted ? 0.5 : 1,
      });
      gsap.set(offIcon, {
        y: muted ? 0 : -40,
        opacity: muted ? 1 : 0,
        scale: muted ? 1 : 0.5,
      });
      hasInitialized.current = true;
      return;
    }
    const tl = gsap.timeline();

    // إخفاء/إظهار أيقونة الصوت
    tl.to(onIcon, {
      y: muted ? 40 : 0,
      opacity: muted ? 0 : 1,
      scale: muted ? 0.5 : 1,
      duration: 0.5,
      ease: "back.out(1.7)",
    });

    // إخفاء/إظهار أيقونة الكتم
    tl.to(
      offIcon,
      {
        y: muted ? 0 : -40,
        opacity: muted ? 1 : 0,
        scale: muted ? 1 : 0.5,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "<",
    );
  }, [muted, mounted]);

  if (!mounted) return null;

  return (
    <button
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      ref={containerRef}
      onClick={handleClick}
      className="relative box-border w-16 h-16 rounded-2xl border-4 flex items-center justify-center cursor-pointer shadow-lg bg-base-cream border-base-yellow dark:bg-base-blue dark:border-base-blue-dark"
    >
      <div
        ref={rippleRef}
        className="absolute -inset-1 rounded-2xl border-4 z-0 pointer-events-none hidden"
      />

      {/* Sound ON */}
      <div
        ref={onIconRef}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <BiSolidVolumeFull className="w-8 h-8 text-base-yellow dark:text-base-blue-dark" />
      </div>

      {/* Sound OFF */}
      <div
        ref={offIconRef}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <BiSolidVolumeMute className="w-8 h-8 text-base-yellow dark:text-base-blue-dark" />
      </div>
    </button>
  );
}
