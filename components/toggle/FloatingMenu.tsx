"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useGameStore } from "@/store/useGameStore";
import { ThemeToggle } from "./ThemeToggle";
import { useUISound } from "@/hooks/audio/useUISound";
import { SettingsMenu } from "./SettingsMenu";
import { ArticlesButton } from "./ArticlesButton";

gsap.registerPlugin(useGSAP);

export function FloatingMenu() {
  const isScreenZoomed = useGameStore((s) => s.isScreenZoomed);
  const setIsScreenZoomed = useGameStore((s) => s.setIsScreenZoomed);

  const isPianoZoomed = useGameStore((s) => s.isPianoZoomed);
  const setIsPianoZoomed = useGameStore((s) => s.setIsPianoZoomed);

  const started = useGameStore((s) => s.started);
  const { playHover, playClick } = useUISound();

  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (started) {
        gsap.to(".gsap-menu-item", {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.5)",
        });
      } else {
        gsap.set(".gsap-menu-item", { y: -60, opacity: 0 });
      }
    },
    {
      scope: menuRef,
      dependencies: [started],
    },
  );

  return (
    <>
      <div
        ref={menuRef}
        className={`fixed top-4 right-4 z-99 flex gap-4 transition-all duration-700 ease-in-out ${
          isScreenZoomed || isPianoZoomed
            ? "opacity-0 pointer-events-none -translate-y-2.5"
            : "opacity-100 pointer-events-auto translate-y-0"
        }`}
      >
        {/* تغليف الأزرار بكلاس GSAP */}
        <div className="gsap-menu-item">
          <ArticlesButton />
        </div>
        <div className="gsap-menu-item">
          <ThemeToggle />
        </div>
        <div className="gsap-menu-item">
          <SettingsMenu />
        </div>
      </div>

      {(isScreenZoomed || isPianoZoomed) && (
        <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-100 animate-fade-in pointer-events-auto">
          {isScreenZoomed && (
            <button
              onClick={() => {
                setIsScreenZoomed(false);
                playClick();
              }}
              onMouseEnter={playHover}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Exit
            </button>
          )}

          {isPianoZoomed && (
            <button
              onClick={() => {
                setIsPianoZoomed(false);
                playClick();
              }}
              onMouseEnter={playHover}
              className="px-8 py-3 bg-white text-black font-bold rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-transform hover:scale-105"
            >
              Stop Playing
            </button>
          )}
        </div>
      )}
    </>
  );
}
