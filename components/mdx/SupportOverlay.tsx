"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import WackyCoin from "@/components/accessories/WackyCoin";
import { IoClose } from "react-icons/io5";
import { useSupportStore } from "@/store/useSupportStore";
import { useGameStore } from "@/store/useGameStore";
import { useShallow } from "zustand/react/shallow";
import Link from "next/link";

const BMC_URL = "https://buymeacoffee.com/MaenAbabneh";

export default function SupportOverlay() {
  const { isOpen, hasShown, openOverlay, closeOverlay } = useSupportStore(
    useShallow((s) => ({
      isOpen: s.isOpen,
      hasShown: s.hasShown,
      openOverlay: s.openOverlay,
      closeOverlay: s.closeOverlay,
    })),
  );

  const [isFull, setIsFull] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { started, isScreenZoomed, isPianoZoomed } = useGameStore(
    useShallow((s) => ({
      started: s.started,
      isScreenZoomed: s.isScreenZoomed,
      isPianoZoomed: s.isPianoZoomed,
    })),
  );

  const isMainScreen = started && !isScreenZoomed && !isPianoZoomed;

  const handleCloseOverlay = useCallback(() => {
    setIsFull(false);
    closeOverlay();
  }, [closeOverlay]);

  // نظام مراقبة الخمول
  useEffect(() => {
    if (hasShown) return;

    const startIdleTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      if (isMainScreen) {
        timerRef.current = setTimeout(() => {
          openOverlay();
        }, 60000); // 60 ثانية
      }
    };

    const resetIdleTimer = () => startIdleTimer();

    if (isMainScreen) {
      startIdleTimer();
      // مراقبة نشاط المستخدم في الشاشة الرئيسية
      window.addEventListener("mousemove", resetIdleTimer);
      window.addEventListener("keydown", resetIdleTimer);
      window.addEventListener("click", resetIdleTimer);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
    };
  }, [isMainScreen, hasShown, openOverlay]);

  // تجميد التمرير في الصفحة عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // إغلاق النافذة باستخدام زر Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseOverlay();
    };

    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, handleCloseOverlay]);

  // عند امتلاء العملة: تحويل تلقائي بعد ثانية إلى صفحة الدعم.
  useEffect(() => {
    if (!isOpen || !isFull) return;

    const redirectTimer = window.setTimeout(() => {
      window.open(BMC_URL, "_blank", "noopener,noreferrer");
    }, 1000);

    return () => window.clearTimeout(redirectTimer);
  }, [isOpen, isFull]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-2000 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={handleCloseOverlay}
      role="button"
      tabIndex={0}
      aria-label="Close support overlay"
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" || e.key === " ") handleCloseOverlay();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-overlay-title"
        className="relative w-full max-w-lg bg-base-cream dark:bg-base-blue-light border-8 border-base-blue dark:border-base-blue-dark rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-300 custom-scrollbar overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) =>
          e.stopPropagation()
        }
      >
        <button
          onClick={handleCloseOverlay}
          aria-label="Close overlay"
          className="absolute top-6 right-6 text-base-blue dark:text-base-blue-dark hover:scale-110 transition-transform"
        >
          <IoClose size={35} aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center gap-0 mt-0">
          <h2
            id="support-overlay-title"
            className="text-2xl md:text-3xl font-black font-serif text-base-blue dark:text-base-blue-dark mb-5"
          >
            Enjoying the content?
          </h2>

          <p className="text-base-brwan font-medium">
            Take a break and play with this <strong>Wacky Coin</strong>. If you
            like what I do, consider fueling my next coding session!
          </p>

          <WackyCoin
            size={300}
            onClicksChange={(c) => c >= 15 && setIsFull(true)}
          />

          <Link
            href={BMC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-8 py-4 bg-[#FFDD00] text-black font-black rounded-2xl shadow-xl transition-all duration-500 ${
              isFull
                ? "animate-bounce scale-110 ring-4 ring-base-yellow"
                : "hover:scale-105"
            }`}
          >
            <div className="relative w-6 h-6">
              <Image
                src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
                alt="BMC"
                fill
                sizes="24px"
                className="object-contain"
              />
            </div>
            <span>Buy me a coffee</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
