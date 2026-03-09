"use client";

import { useOverlayStore } from "@/store/useOverlayStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import AboutSection from "../Section/AboutSection";
import ContactSection from "../Section/ContactSection";
import WorksSection from "../Section/WorksSection";
import ModalLayout from "./ModalLayout"; // استيراد المكون الجديد

// إعدادات الأحجام حسب نوع القسم (مطابقة للـ CSS الأصلي)
const sectionConfig = {
  about: {
    classes: "w-[90%] max-w-[800px] h-auto ",
    title: "About Me",
  },
  works: {
    classes: "w-[90%] max-w-[1200px] h-[85vh] md:h-[700px]",
    title: "My Work",
  },
  contact: {
    classes: "w-[90%] max-w-[650px] h-auto min-h-[300px]",
    title: "Say Hello!",
  },
  articles: {
    classes: "w-[90%] max-w-[800px] h-[80vh]",
    title: "Articles",
  },
};

type SectionKey = keyof typeof sectionConfig;

export default function Overlay() {
  const { isOpen, section, closeOverlay } = useOverlayStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const activeSection: SectionKey = section ?? "about";

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOverlay]);

  useGSAP(() => {
    if (isOpen) {
      // 1. Overlay Fade In
      gsap.to(containerRef.current, {
        autoAlpha: 1,
        duration: 0.4,
      });
      // 2. Modal Pop In (Scale + Opacity) - نفس تأثير back.out(2)
      gsap.fromTo(
        contentRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
      );
    } else {
      // Exit Animation
      gsap.to(containerRef.current, {
        autoAlpha: 0,
        duration: 0.3,
      });
      gsap.to(contentRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
      });
    }
  }, [isOpen]);

  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return <AboutSection />;
      case "works":
        return <WorksSection />;
      case "contact":
        return <ContactSection />;
      default:
        return null;
    }
  };

  const config = sectionConfig[activeSection];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 invisible"
      tabIndex={0}
      onClick={(e) => {
        // إغلاق عند الضغط على الخلفية فقط
        if (e.target === e.currentTarget) closeOverlay();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
          closeOverlay();
        }
      }}
    >
      {/* Wrapper للأنيميشن */}
      <div ref={contentRef}>
        <ModalLayout title={config.title} className={config.classes}>
          {renderContent()}
        </ModalLayout>
      </div>
    </div>
  );
}
