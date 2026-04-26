"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useGameStore } from "@/store/useGameStore";
import { useUISound } from "@/hooks/audio/useUISound";
import { getEnabledActions } from "@/constant/sidebarActions";
import {
  GOOEY_SIDEBAR_FILTER,
  GOOEY_SIDEBAR_LAYOUT,
  getCenterY,
  getRailHeight,
} from "@/constant/gooeySidebar";
import { cn } from "@/utils/cn";

// Dynamic icon imports
import {
  MdCalendarToday,
  MdCall,
  MdEmail,
  MdDownload,
  MdMoreVert,
} from "react-icons/md";
import { FaWhatsapp, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

import { GooeyContactDesktop } from "./GooeyContactDesktop";
import { GooeyContactMobile } from "./GooeyContactMobile";

const iconMap: Record<string, React.ReactNode> = {
  MdCalendarToday: <MdCalendarToday className="w-6 h-6" />,
  MdCall: <MdCall className="w-6 h-6" />,
  MdEmail: <MdEmail className="w-6 h-6" />,
  MdDownload: <MdDownload className="w-6 h-6" />,
  FaWhatsapp: <FaWhatsapp className="w-6 h-6" />,
  FaGithub: <FaGithub className="w-6 h-6" />,
  FaLinkedin: <FaLinkedin className="w-6 h-6" />,
  FaInstagram: <FaInstagram className="w-6 h-6" />,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || <MdMoreVert className="w-6 h-6" />;
};

export default function GooeyContactSidebar() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs التي يجب تمريرها للأبناء
  const desktopBlobRef = useRef<SVGCircleElement>(null);
  const mobileLineRef = useRef<SVGLineElement>(null);
  const mobileBlobRef = useRef<SVGCircleElement>(null);

  const activeIndexRef = useRef(0);
  const reactId = useId();
  const filterId = `gooey-sidebar-${reactId.replace(/:/g, "")}`;

  const started = useGameStore((s) => s.started);
  const isScreenZoomed = useGameStore((s) => s.isScreenZoomed);
  const isPianoZoomed = useGameStore((s) => s.isPianoZoomed);

  const { playHover, playClick } = useUISound();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const enabledActions = getEnabledActions();

  // Calculate mobile bottom origin Y (point where line starts from FAB)
  const mobileHeight = getRailHeight(
    enabledActions.length,
    GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
    GOOEY_SIDEBAR_LAYOUT.mobile.slotSize,
    GOOEY_SIDEBAR_LAYOUT.mobile.padding,
  );
  const mobileBottomOriginY = mobileHeight;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useGSAP(
    () => {
      const initial = Math.min(
        activeIndexRef.current,
        Math.max(0, enabledActions.length - 1),
      );
      const desktopStart = getCenterY(
        initial,
        GOOEY_SIDEBAR_LAYOUT.desktop.dotSize,
        GOOEY_SIDEBAR_LAYOUT.desktop.slotSize,
        GOOEY_SIDEBAR_LAYOUT.desktop.padding,
      );

      // تطبيق المكان الابتدائي للـ blob في desktop
      if (desktopBlobRef.current) {
        gsap.set(desktopBlobRef.current, { attr: { cy: desktopStart } });
      }

      // Mobile: line and blob start from bottomOriginY (hidden inside FAB)
      if (mobileLineRef.current && mobileBlobRef.current) {
        gsap.set(mobileLineRef.current, {
          attr: { y1: mobileBottomOriginY, y2: mobileBottomOriginY },
        });
        gsap.set(mobileBlobRef.current, { attr: { cy: mobileBottomOriginY } });
      }
    },
    { dependencies: [enabledActions.length, isMobile] },
  );

  // Mobile: Animate line and blob when FAB opens/closes
  useGSAP(
    () => {
      if (!isMobile) return;

      if (isFabOpen) {
        // FAB opening: line extends from bottom to first icon
        const firstIconY = getCenterY(
          0,
          GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
          GOOEY_SIDEBAR_LAYOUT.mobile.slotSize,
          GOOEY_SIDEBAR_LAYOUT.mobile.padding,
        );

        if (mobileLineRef.current) {
          gsap.killTweensOf(mobileLineRef.current);
          gsap.to(mobileLineRef.current, {
            attr: { y1: firstIconY },
            duration: GOOEY_SIDEBAR_LAYOUT.mobile.revealDuration,
            ease: "power2.out",
          });
        }

        if (mobileBlobRef.current) {
          gsap.killTweensOf(mobileBlobRef.current);
          gsap.to(mobileBlobRef.current, {
            attr: { cy: firstIconY },
            duration: GOOEY_SIDEBAR_LAYOUT.mobile.blobDuration,
            ease: "power2.out",
          });
        }
      } else {
        // FAB closing: line retracts back to bottom
        if (mobileLineRef.current) {
          gsap.killTweensOf(mobileLineRef.current);
          gsap.to(mobileLineRef.current, {
            attr: { y1: mobileBottomOriginY },
            duration: GOOEY_SIDEBAR_LAYOUT.mobile.collapseDuration,
            ease: "power2.in",
          });
        }

        if (mobileBlobRef.current) {
          gsap.killTweensOf(mobileBlobRef.current);
          gsap.to(mobileBlobRef.current, {
            attr: { cy: mobileBottomOriginY },
            duration: GOOEY_SIDEBAR_LAYOUT.mobile.collapseDuration,
            ease: "power2.in",
          });
        }
      }
    },
    { dependencies: [isFabOpen, isMobile] },
  );

  const animateRailToIndex = (index: number) => {
    if (index < 0 || index >= enabledActions.length) return;

    const prev = activeIndexRef.current;
    if (index === prev) return;

    const desktopTarget = getCenterY(
      index,
      GOOEY_SIDEBAR_LAYOUT.desktop.dotSize,
      GOOEY_SIDEBAR_LAYOUT.desktop.slotSize,
      GOOEY_SIDEBAR_LAYOUT.desktop.padding,
    );
    const mobileTarget = getCenterY(
      index,
      GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
      GOOEY_SIDEBAR_LAYOUT.mobile.slotSize,
      GOOEY_SIDEBAR_LAYOUT.mobile.padding,
    );

    if (desktopBlobRef.current) {
      gsap.killTweensOf(desktopBlobRef.current);
      gsap.to(desktopBlobRef.current, {
        attr: { cy: desktopTarget },
        duration: GOOEY_SIDEBAR_LAYOUT.desktop.blobDuration,
        ease: "sine.inOut",
      });
    }

    if (mobileLineRef.current && mobileBlobRef.current) {
      // Mobile: only animate y1 (top point) to selected icon
      // y2 (bottom point) stays fixed at mobileBottomOriginY
      gsap.killTweensOf(mobileLineRef.current);
      gsap.to(mobileLineRef.current, {
        attr: { y1: mobileTarget },
        duration: GOOEY_SIDEBAR_LAYOUT.mobile.railDuration,
        ease: "sine.inOut",
      });

      gsap.killTweensOf(mobileBlobRef.current);
      gsap.to(mobileBlobRef.current, {
        attr: { cy: mobileTarget },
        duration: GOOEY_SIDEBAR_LAYOUT.mobile.blobDuration,
        ease: "sine.inOut",
      });
    }

    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  const isVisible = started && !isScreenZoomed && !isPianoZoomed;

  if (!isVisible) {
    return null;
  }

  const handleActionClick = () => {
    playClick();
    if (isMobile) {
      setIsFabOpen(false);
    }
  };

  const handleFabToggle = () => {
    playClick();
    setIsFabOpen(!isFabOpen);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-50 pointer-events-auto",
        isMobile ? "bottom-6 right-6" : "left-6 top-1/2 -translate-y-1/2",
      )}
      style={
        !isMobile
          ? { willChange: "transform" }
          : { willChange: "transform, opacity" }
      }
    >
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={GOOEY_SIDEBAR_FILTER.blurStdDeviation}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values={GOOEY_SIDEBAR_FILTER.colorMatrixValues}
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {!isMobile && (
        <GooeyContactDesktop
          filterId={filterId}
          enabledActions={enabledActions}
          activeIndex={activeIndex}
          onAnimateRail={animateRailToIndex}
          playHover={playHover}
          getIcon={getIcon}
          desktopBlobRef={desktopBlobRef} // تمرير Ref
        />
      )}

      {isMobile && (
        <GooeyContactMobile
          filterId={filterId}
          enabledActions={enabledActions}
          activeIndex={activeIndex}
          isFabOpen={isFabOpen}
          onFabToggle={handleFabToggle}
          onAnimateRail={animateRailToIndex}
          onActionClick={handleActionClick}
          playHover={playHover}
          getIcon={getIcon}
          mobileLineRef={mobileLineRef} // تمرير Ref
          mobileBlobRef={mobileBlobRef} // تمرير Ref
        />
      )}
    </div>
  );
}
