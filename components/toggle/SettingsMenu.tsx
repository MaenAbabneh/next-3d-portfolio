"use client";

import {
  useId,
  useRef,
  useEffect,
  useSyncExternalStore,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { IoSettingsSharp } from "react-icons/io5";
import { useTheme } from "next-themes";
import { useUISound } from "@/hooks/audio/useUISound";
import ModalLayout from "../overlay/ModalLayout";
import { useRipple } from "@/hooks/animations/useRipple";
import { BgmSetting } from "./settings/BgmSetting";
import { SfxSetting } from "./settings/SfxSetting";
import { ThemeSetting } from "./settings/ThemeSetting";
import { FullscreenSetting } from "./settings/FullscreenSetting";
import { GraphicsSetting } from "./settings/GraphicsSetting";
import { LanguageSetting } from "./settings/LanguageSetting";
import { PianoSetting } from "./settings/PianoSetting";

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selectors));
}

export function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  const { theme, resolvedTheme } = useTheme();
  const { playClick, playHover } = useUISound();

  const isDark = (resolvedTheme ?? theme) === "dark";
  const dialogLabelId = useId();

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

  const toggleMenu = (e?: React.MouseEvent) => {
    if (e) registerClick(e);
    if (!isOpen) playClick();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!mounted || !isOpen) return;

    previouslyFocusedElementRef.current =
      (document.activeElement as HTMLElement | null) ?? null;
    document.body.style.overflow = "hidden";

    const id = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = "";
      previouslyFocusedElementRef.current?.focus?.();
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted || !isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key !== "Tab") return;

      const focusables = getFocusableElements(dialogRef.current);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || active === null)) {
        e.preventDefault();
        last.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, mounted]);

  useGSAP(() => {
    if (!mounted || !overlayRef.current || !modalRef.current) return;

    if (isOpen) {
      gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.4,
      });
      gsap.fromTo(
        modalRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
      );
    } else {
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.3,
      });
      gsap.to(modalRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
      });
    }
  }, [isOpen, mounted]);

  return (
    <>
      <button
        ref={containerRef}
        type="button"
        onClick={toggleMenu}
        onMouseEnter={playHover}
        aria-label={isOpen ? "Close settings" : "Open settings"}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="relative box-border w-16 h-16 rounded-2xl border-4 flex items-center justify-center cursor-pointer shadow-lg bg-base-cream border-base-blue dark:bg-base-blue-light dark:border-base-blue-dark hover:scale-105 transition-transform z-50 group"
      >
        <div
          ref={rippleRef}
          className="absolute -inset-1 rounded-2xl border-4 z-0 pointer-events-none hidden"
        />
        <IoSettingsSharp className="w-8 h-8 text-base-blue dark:text-base-blue-dark transition-transform duration-500 group-hover:rotate-90 z-10 relative" />
      </button>

      {mounted
        ? createPortal(
            <div
              ref={overlayRef}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-999999 flex items-center justify-center pointer-events-none opacity-0"
              style={{ pointerEvents: isOpen ? "auto" : "none" }}
              aria-hidden={!isOpen}
            >
              <button
                type="button"
                tabIndex={-1}
                aria-label="Close settings"
                className="absolute inset-0 bg-transparent"
                onClick={() => setIsOpen(false)}
              />

              <div ref={modalRef} className="opacity-0 w-[90%] max-w-md">
                <div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={dialogLabelId}
                  tabIndex={-1}
                  className="outline-none"
                >
                  <span id={dialogLabelId} className="sr-only">
                    Settings
                  </span>

                  <ModalLayout title="Settings" onClose={() => toggleMenu()}>
                    <div className="flex flex-col gap-6 mt-2 w-full max-h-[60vh] overflow-y-auto custom-scrollbar px-1 pb-4">
                      <BgmSetting />
                      <SfxSetting />
                      <PianoSetting />
                      <div className="w-full h-0.5 bg-base-blue/10 dark:bg-white/10 my-2 rounded-full" />{" "}
                      <FullscreenSetting />
                      <GraphicsSetting />
                      <div className="w-full h-0.5 bg-base-blue/10 dark:bg-white/10 my-2 rounded-full" />{" "}
                      <ThemeSetting />
                      <LanguageSetting />
                    </div>
                  </ModalLayout>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
