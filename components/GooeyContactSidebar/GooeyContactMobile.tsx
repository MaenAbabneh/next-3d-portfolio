"use client";

import { useRef } from "react";
import Link from "next/link";
import { MdMoreVert } from "react-icons/md";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/utils/cn";
import {
  GOOEY_SIDEBAR_LAYOUT,
  GOOEY_SIDEBAR_VIEW,
  getCenterY,
  getRailHeight,
  getTopY,
} from "@/constant/gooeySidebar";
import type { SidebarAction } from "@/constant/sidebarActions";

interface GooeyContactMobileProps {
  filterId: string;
  enabledActions: SidebarAction[];
  activeIndex: number;
  isFabOpen: boolean;
  onFabToggle: () => void;
  onAnimateRail: (index: number) => void;
  onActionClick: () => void;
  playHover: () => void;
  getIcon: (iconName: string) => React.ReactNode;
  // إضافة الـ Refs
  mobileLineRef: React.RefObject<SVGLineElement | null>;
  mobileBlobRef: React.RefObject<SVGCircleElement | null>;
}

export function GooeyContactMobile({
  filterId,
  enabledActions,
  activeIndex,
  isFabOpen,
  onFabToggle,
  onAnimateRail,
  onActionClick,
  playHover,
  getIcon,
  mobileLineRef,
  mobileBlobRef,
}: GooeyContactMobileProps) {
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const mobileHeight = getRailHeight(
    enabledActions.length,
    GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
    GOOEY_SIDEBAR_LAYOUT.mobile.slotSize,
    GOOEY_SIDEBAR_LAYOUT.mobile.padding,
  );
  const mobileCenterX = GOOEY_SIDEBAR_LAYOUT.mobile.width / 2;

  useGSAP(
    () => {
      if (!isFabOpen || !mobilePanelRef.current) return;

      gsap.killTweensOf(mobilePanelRef.current);
      gsap.fromTo(
        mobilePanelRef.current,
        { autoAlpha: 0, y: 8, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: GOOEY_SIDEBAR_LAYOUT.mobile.revealDuration,
          ease: "power2.out",
        },
      );
    },
    { dependencies: [isFabOpen] },
  );

  useGSAP(
    () => {
      if (isFabOpen || !mobilePanelRef.current) return;

      gsap.to(mobilePanelRef.current, {
        autoAlpha: 0,
        y: 8,
        scale: 0.98,
        duration: GOOEY_SIDEBAR_LAYOUT.mobile.closeDuration,
        ease: "power2.in",
      });
    },
    { dependencies: [isFabOpen] },
  );

  return (
    <>
      <button
        onClick={onFabToggle}
        aria-label="Toggle contact options"
        aria-expanded={isFabOpen}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
          "bg-base-blue text-base-cream dark:bg-base-blue-dark dark:text-base-cream",
          "hover:scale-110 active:scale-95",
          isFabOpen && "rotate-45",
        )}
        style={{
          willChange: "transform, rotate",
        }}
      >
        <MdMoreVert className="w-6 h-6" />
      </button>

      <div
        ref={mobilePanelRef}
        className={GOOEY_SIDEBAR_VIEW.mobile.panelClass}
        style={{
          pointerEvents: isFabOpen ? "auto" : "none",
          opacity: 0,
        }}
      >
        <div
          className="relative"
          style={{
            width: GOOEY_SIDEBAR_LAYOUT.mobile.width,
            height: mobileHeight,
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: `url(#${filterId})`,
              willChange: "transform, filter",
            }}
          >
            <svg
              viewBox={`0 0 ${GOOEY_SIDEBAR_LAYOUT.mobile.width} ${mobileHeight}`}
              className="w-full h-full overflow-visible"
            >
              <g>
                <line
                  ref={mobileLineRef} // ربط الـ Ref
                  x1={mobileCenterX}
                  x2={mobileCenterX}
                  y1={getCenterY(
                    0,
                    GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
                    GOOEY_SIDEBAR_LAYOUT.mobile.slotSize,
                    GOOEY_SIDEBAR_LAYOUT.mobile.padding,
                  )}
                  y2={getCenterY(
                    0,
                    GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
                    GOOEY_SIDEBAR_LAYOUT.mobile.slotSize,
                    GOOEY_SIDEBAR_LAYOUT.mobile.padding,
                  )}
                  stroke="var(--bg-color-blue)"
                  strokeWidth={GOOEY_SIDEBAR_LAYOUT.mobile.dotSize - 8}
                  strokeLinecap="round"
                />

                {enabledActions.map((action, idx) => (
                  <circle
                    key={`mob-bg-${action.id}`}
                    cx={mobileCenterX}
                    cy={getCenterY(
                      idx,
                      GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
                      GOOEY_SIDEBAR_LAYOUT.mobile.slotSize,
                      GOOEY_SIDEBAR_LAYOUT.mobile.padding,
                    )}
                    r={GOOEY_SIDEBAR_LAYOUT.mobile.dotSize / 2}
                    fill="transparent"
                  />
                ))}

                <circle
                  ref={mobileBlobRef} // ربط الـ Ref
                  cx={mobileCenterX}
                  cy={getCenterY(
                    0,
                    GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
                    GOOEY_SIDEBAR_LAYOUT.mobile.slotSize,
                    GOOEY_SIDEBAR_LAYOUT.mobile.padding,
                  )}
                  r={GOOEY_SIDEBAR_LAYOUT.mobile.dotSize / 2}
                  fill="var(--bg-color-dark-blue)"
                />
              </g>
            </svg>
          </div>

          <div className="relative z-10" style={{ height: mobileHeight }}>
            {enabledActions.map((action, idx) => (
              <Link
                key={action.id}
                href={action.href}
                target={action.target}
                rel={action.rel}
                aria-label={action.ariaLabel}
                onMouseEnter={() => {
                  playHover();
                  onAnimateRail(idx);
                }}
                onFocus={() => onAnimateRail(idx)}
                onClick={() => {
                  onAnimateRail(idx);
                  onActionClick();
                }}
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center",
                  "transition-all duration-250 ease-out hover:scale-[1.06] active:scale-95",
                  activeIndex === idx
                    ? "bg-base-blue-dark text-base-cream shadow-lg"
                    : "bg-base-blue-light text-base-blue",
                )}
                style={{
                  top: getTopY(
                    idx,
                    GOOEY_SIDEBAR_LAYOUT.mobile.slotSize,
                    GOOEY_SIDEBAR_LAYOUT.mobile.padding,
                  ),
                  width: GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
                  height: GOOEY_SIDEBAR_LAYOUT.mobile.dotSize,
                  willChange: "transform",
                }}
                title={action.disabledReason || action.label}
              >
                {getIcon(action.icon)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
