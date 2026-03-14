/* eslint-disable prettier/prettier */
"use client";

import { useOverlayStore } from "@/store/useOverlayStore";
import gsap from "gsap";
import { useCallback, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

interface ModalLayoutProps {
  children: React.ReactNode;
  title: string;
  className?: string;
}

export default function ModalLayout({
  children,
  title,
  className = "",
}: ModalLayoutProps) {
  const { closeOverlay } = useOverlayStore();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    gsap.set(button, {
      rotate: -15,
      scale: 1,
      transformOrigin: "50% 50%",
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    gsap.to(button, {
      rotate: 25,
      scale: 1.125,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    gsap.to(button, {
      rotate: -15,
      scale: 1,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, []);

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const button = buttonRef.current;
      if (!button) {
        closeOverlay();
        return;
      }

      gsap.killTweensOf(button);

      gsap.to(button, {
        scale: 1.5,
        duration: 0.2,
        ease: "back.out(2)",
        onComplete: () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.2,
            onComplete: () => {
              gsap.set(button, { clearProps: "transform" });
              closeOverlay();
            },
          });
        },
      });
    },
    [closeOverlay]
  );

  return (
    <div
      className={`relative flex flex-col items-center bg-base-cream dark:bg-base-blue-light border-8 border-base-blue dark:border-base-blue-dark rounded-[25px] p-6 md:p-8 shadow-2xl max-h-full ${className}`}
    >
      {/* 1. العنوان */}
      <h1 className="relative -top-2 px-10 py-2 rounded-full border-4 border-base-blue dark:border-base-blue-dark text-xl md:text-3xl font-bold text-base-brwan shadow-md mb-6 text-center font-serif shrink-0">
        {title}
      </h1>

      {/* 2. المحتوى */}
      <div className="w-full h-full flex-1 overflow-y-auto custom-scrollbar px-2">
        {children}
      </div>
      <div className="absolute z-50 -bottom-10 left-1/2 -translate-x-1/2 md:bottom-auto md:-top-10 md:-left-10 md:translate-x-0">
        <button
          ref={buttonRef}
          onClick={handleClose}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-base-cream dark:bg-base-blue-light border-[6px] border-base-blue dark:border-base-blue-dark rounded-2xl shadow-lg"
        >
          <IoClose className="w-8 h-8 md:w-12 md:h-12 text-base-blue dark:text-base-blue-dark" />
        </button>
      </div>
    </div>
  );
}
