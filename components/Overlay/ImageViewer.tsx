"use client";

import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useImageViewerStore } from "@/store/useImageViewerStore";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ImageViewer() {
  const { isOpen, activeImage, closeImage } = useImageViewerStore();

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const overlayEl = overlayRef.current;
      const contentEl = contentRef.current;
      if (!overlayEl || !contentEl) return;

      gsap.killTweensOf([overlayEl, contentEl]);

      if (isOpen) {
        gsap.set(overlayEl, { pointerEvents: "auto" });

        gsap.fromTo(
          overlayEl,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
        );

        gsap.fromTo(
          contentEl,
          { y: 24, scale: 0.92 },
          { y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" },
        );
      } else {
        gsap.to(contentEl, {
          y: 24,
          scale: 0.92,
          duration: 0.22,
          ease: "power2.in",
        });

        gsap.to(overlayEl, {
          autoAlpha: 0,
          duration: 0.22,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(overlayEl, { pointerEvents: "none" });
          },
        });
      }
    },
    { dependencies: [isOpen] },
  );

  return (
    <div
      ref={overlayRef}
      className={`
        fixed inset-0 z-9999999 
        flex items-center justify-center 
        bg-black/90 backdrop-blur-md
        opacity-0 pointer-events-none
      `}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      onClick={closeImage} // إغلاق عند الضغط في أي مكان
    >
      {/* زر الإغلاق */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeImage();
        }}
        className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"
      >
        <IoClose size={32} />
      </button>

      {/* حاوية الصورة */}
      {activeImage && (
        <div
          ref={contentRef}
          className="relative w-[90vw] h-[85vh] will-change-transform"
          onClick={(e) => e.stopPropagation()} // منع الإغلاق عند الضغط على الصورة
        >
          <Image
            src={activeImage}
            alt="Full Size Preview"
            fill
            className="object-contain drop-shadow-2xl"
            sizes="90vw"
            priority
          />
        </div>
      )}
    </div>
  );
}
