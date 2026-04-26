"use client";

import { useRef } from "react";
import Link from "next/link";
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

interface GooeyContactDesktopProps {
  filterId: string;
  enabledActions: SidebarAction[];
  activeIndex: number;
  onAnimateRail: (index: number) => void;
  playHover: () => void;
  getIcon: (iconName: string) => React.ReactNode;
  desktopBlobRef: React.RefObject<SVGCircleElement | null>;
}

export function GooeyContactDesktop({
  filterId,
  enabledActions,
  activeIndex,
  onAnimateRail,
  playHover,
  getIcon,
  desktopBlobRef,
}: GooeyContactDesktopProps) {
  const desktopWrapRef = useRef<HTMLDivElement>(null);

  const desktopHeight = getRailHeight(
    enabledActions.length,
    GOOEY_SIDEBAR_LAYOUT.desktop.dotSize,
    GOOEY_SIDEBAR_LAYOUT.desktop.slotSize,
    GOOEY_SIDEBAR_LAYOUT.desktop.padding,
  );
  const desktopCenterX = GOOEY_SIDEBAR_LAYOUT.desktop.width / 2;

  useGSAP(
    () => {
      if (!desktopWrapRef.current) return;
      gsap.fromTo(
        desktopWrapRef.current,
        { autoAlpha: 0, x: -18 },
        {
          autoAlpha: 1,
          x: 0,
          duration: GOOEY_SIDEBAR_LAYOUT.desktop.revealDuration,
          ease: "power2.out",
        },
      );
    },
    { dependencies: [] },
  );

  return (
    <div
      ref={desktopWrapRef}
      className={GOOEY_SIDEBAR_VIEW.desktop.railClass}
      style={{
        width: GOOEY_SIDEBAR_LAYOUT.desktop.width,
        height: desktopHeight,
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
          viewBox={`0 0 ${GOOEY_SIDEBAR_LAYOUT.desktop.width} ${desktopHeight}`}
          className="w-full h-full overflow-visible"
        >
          <g>
            {enabledActions.map((action, idx) => (
              <circle
                key={`desk-bg-${action.id}`}
                cx={desktopCenterX}
                cy={getCenterY(
                  idx,
                  GOOEY_SIDEBAR_LAYOUT.desktop.dotSize,
                  GOOEY_SIDEBAR_LAYOUT.desktop.slotSize,
                  GOOEY_SIDEBAR_LAYOUT.desktop.padding,
                )}
                r={GOOEY_SIDEBAR_LAYOUT.desktop.dotSize / 2}
                fill="transparent"
              />
            ))}

            <circle
              ref={desktopBlobRef} // ربط الـ Ref
              cx={desktopCenterX}
              cy={getCenterY(
                0,
                GOOEY_SIDEBAR_LAYOUT.desktop.dotSize,
                GOOEY_SIDEBAR_LAYOUT.desktop.slotSize,
                GOOEY_SIDEBAR_LAYOUT.desktop.padding,
              )}
              r={GOOEY_SIDEBAR_LAYOUT.desktop.dotSize / 2}
              fill="var(--bg-color-dark-blue)"
            />
          </g>
        </svg>
      </div>

      <div className="relative z-10" style={{ height: desktopHeight }}>
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
            }}
            className={cn(
              "group absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center",
              "transition-all duration-250 ease-out hover:scale-[1.08] active:scale-95",
              activeIndex === idx
                ? "bg-base-blue-dark text-base-cream shadow-lg"
                : "bg-base-blue-light/95 text-base-blue",
            )}
            style={{
              top: getTopY(
                idx,
                GOOEY_SIDEBAR_LAYOUT.desktop.slotSize,
                GOOEY_SIDEBAR_LAYOUT.desktop.padding,
              ),
              width: GOOEY_SIDEBAR_LAYOUT.desktop.dotSize,
              height: GOOEY_SIDEBAR_LAYOUT.desktop.dotSize,
              willChange: "transform",
            }}
            title={action.disabledReason || action.label}
          >
            {getIcon(action.icon)}
            <div className="absolute left-full ml-2 px-2 py-1 bg-base-blue dark:bg-base-blue-dark text-base-cream rounded whitespace-nowrap text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {action.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
