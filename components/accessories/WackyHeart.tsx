"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

import LikeButtonSVG from "../Icons/LikeButtonSVG";
import {
  DECREMENT_RETURN_DELAY_MS,
  HOVER_LEAVE_RETURN_DELAY_MS,
  MouthState,
} from "@/constant/coinConstants";

import { useLikeSvgIds } from "@/constant/useLikeSvgIds";
import { useDeltaLabelAnimation } from "@/hooks/animations/wackyCoin/useDeltaLabelAnimation";
import { useFullParticles } from "@/hooks/animations/wackyCoin/useFullParticles";
import { useFullBounce } from "@/hooks/animations/wackyCoin/useFullBounce";
import { useWackyCoinTilt } from "@/hooks/animations/wackyCoin/useWackyCoinTilt";
import { useMouthMorph } from "@/hooks/animations/wackyCoin/useMouthMorph";
import { useUISound } from "@/hooks/audio/useUISound";

type WackyHeartProps = {
  size?: number;
  iconScale?: number;
  onClicksChange?: (clicks: number) => void;
};

const HEART_VIEWBOX = {
  width: 50,
  height: 42,
} as const;

const HEART_MOUTH_PATHS: Record<MouthState, string> = {
  sad: "M 20 30 Q 25 27.5 30 30",
  happy: "M 20 30 Q 25 33.6 30 30",
};

const pointsForFill = (fillRatio: number) => {
  const clamped = Math.max(0, Math.min(1, fillRatio));
  const yTop = HEART_VIEWBOX.height * (1 - clamped);
  return `0,${HEART_VIEWBOX.height} ${HEART_VIEWBOX.width},${HEART_VIEWBOX.height} ${HEART_VIEWBOX.width},${yTop} 0,${yTop}`;
};

const HEART_MAX_CLICKS = 15;
const FIRST_CLICK_FILL_RATIO = 0.3;

const fillRatioForClicks = (clicks: number) => {
  const safeClicks = Math.max(
    0,
    Math.min(HEART_MAX_CLICKS, Math.trunc(clicks)),
  );
  if (safeClicks <= 0) return 0;
  if (safeClicks >= HEART_MAX_CLICKS) return 1;
  if (safeClicks === 1) return FIRST_CLICK_FILL_RATIO;

  const remainingClicks = HEART_MAX_CLICKS - 1;
  const remainingFill = 1 - FIRST_CLICK_FILL_RATIO;
  const step = remainingFill / remainingClicks;
  return FIRST_CLICK_FILL_RATIO + (safeClicks - 1) * step;
};

export default function WackyHeart({
  size = 120,
  iconScale = 0.66,
  onClicksChange,
}: WackyHeartProps) {
  const [clicks, setClicks] = useState(0);
  const [mouthState, setMouthState] = useState<MouthState>("happy");
  const [deltaText, setDeltaText] = useState<"+1" | "-1" | null>(null);
  const [deltaSeq, setDeltaSeq] = useState(0);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const clicksRef = useRef(0);

  const tiltRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);

  const activeMaskPolygonRef = useRef<SVGPolygonElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);

  const sadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const hoverInteractedRef = useRef(false);

  const deltaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deltaLabelRef = useRef<HTMLDivElement>(null);

  const svgIds = useLikeSvgIds();

  const isFull = clicks === HEART_MAX_CLICKS;

  const { playGlug, playFanfare } = useUISound();

  useDeltaLabelAnimation({ deltaText, deltaSeq, deltaLabelRef });
  useFullParticles({ isFull, particlesContainerRef, yOffsetPx: -16 });
  useFullBounce({
    isFull,
    coinRef,
    tiltRef,
    onCelebrationChange: setIsCelebrating,
    jumpPx: 20,
    rotationDeg: 10,
  });

  const { setEyesGroupRef, handleMouseMove, handleMouseLeaveVisual } =
    useWackyCoinTilt({
      isFull,
      tiltRef,
      svgOrigin: "25 21",
    });

  useMouthMorph({
    isFull,
    mouthState,
    mouthRef,
    mouthPaths: HEART_MOUTH_PATHS,
  });

  useEffect(() => {
    return () => {
      if (deltaTimerRef.current) clearTimeout(deltaTimerRef.current);
      if (sadTimerRef.current) clearTimeout(sadTimerRef.current);
    };
  }, []);

  useEffect(() => {
    clicksRef.current = clicks;
  }, [clicks]);

  useEffect(() => {
    onClicksChange?.(clicks);
  }, [clicks, onClicksChange]);

  const scale = useMemo(() => {
    if (!Number.isFinite(size) || size <= 0) return 1;
    return size / 120;
  }, [size]);

  const visualScale = useMemo(() => {
    if (!Number.isFinite(iconScale)) return 0.86;
    return Math.max(0.2, Math.min(1, iconScale));
  }, [iconScale]);

  const canUseDOM = typeof document !== "undefined";
  const lastPortalRectRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const syncParticlesLayerPosition = () => {
    const host = hostRef.current;
    const portal = particlesContainerRef.current;
    if (!host || !portal) return;

    const rect = host.getBoundingClientRect();

    const next = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    const prev = lastPortalRectRef.current;
    if (
      prev &&
      prev.left === next.left &&
      prev.top === next.top &&
      prev.width === next.width &&
      prev.height === next.height
    ) {
      return;
    }

    lastPortalRectRef.current = next;
    portal.style.left = `${next.left}px`;
    portal.style.top = `${next.top}px`;
    portal.style.width = `${next.width}px`;
    portal.style.height = `${next.height}px`;
  };

  const findScrollParent = (el: HTMLElement | null) => {
    let node: HTMLElement | null = el?.parentElement ?? null;
    while (node) {
      const style = window.getComputedStyle(node);
      const overflowY = style.overflowY;
      if (
        overflowY === "auto" ||
        overflowY === "scroll" ||
        overflowY === "overlay"
      ) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  };

  useLayoutEffect(() => {
    if (activeMaskPolygonRef.current) {
      gsap.set(activeMaskPolygonRef.current, {
        attr: { points: pointsForFill(fillRatioForClicks(0)) },
      });
    }

    if (tiltRef.current) {
      gsap.set(tiltRef.current, { transformOrigin: "50% 50%" });
    }
    if (coinRef.current) {
      gsap.set(coinRef.current, { transformOrigin: "50% 50%" });
    }
  }, []);

  useLayoutEffect(() => {
    if (!canUseDOM) return;
    syncParticlesLayerPosition();
  }, [canUseDOM, size]);

  useEffect(() => {
    if (!canUseDOM) return;

    let rafId = 0;
    const tick = () => {
      syncParticlesLayerPosition();
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [canUseDOM]);

  useEffect(() => {
    if (!canUseDOM) return;

    const host = hostRef.current;
    if (!host) return;

    const scrollParent = findScrollParent(host);
    const handler = () => syncParticlesLayerPosition();

    scrollParent?.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);

    return () => {
      scrollParent?.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [canUseDOM]);

  const handleAction = (increment: boolean) => {
    if (isCelebrating) return;
    hoverInteractedRef.current = true;
    playGlug();

    const currentClicks = clicksRef.current;
    if (increment && currentClicks >= HEART_MAX_CLICKS) return;

    const newClicks = increment
      ? Math.min(currentClicks + 1, HEART_MAX_CLICKS)
      : Math.max(currentClicks - 1, 0);

    clicksRef.current = newClicks;
    setClicks(newClicks);
    setMouthState(increment ? "happy" : "sad");

    if (increment && newClicks === HEART_MAX_CLICKS) {
      setIsCelebrating(true);
      playFanfare();
    }

    if (newClicks > currentClicks) {
      setDeltaText("+1");
      setDeltaSeq((v) => v + 1);
    } else if (newClicks < currentClicks) {
      setDeltaText("-1");
      setDeltaSeq((v) => v + 1);
    }

    if (deltaTimerRef.current) clearTimeout(deltaTimerRef.current);
    if (newClicks !== currentClicks) {
      deltaTimerRef.current = setTimeout(() => {
        setDeltaText(null);
      }, 800);
    }

    if (sadTimerRef.current) clearTimeout(sadTimerRef.current);
    if (!increment) {
      sadTimerRef.current = setTimeout(() => {
        if (clicksRef.current < HEART_MAX_CLICKS) setMouthState("happy");
      }, DECREMENT_RETURN_DELAY_MS);
    }

    if (activeMaskPolygonRef.current) {
      gsap.killTweensOf(activeMaskPolygonRef.current);
      gsap.to(activeMaskPolygonRef.current, {
        attr: { points: pointsForFill(fillRatioForClicks(newClicks)) },
        duration: 0.6,
        ease: "back.out(1.2)",
      });
    }

    if (coinRef.current) {
      gsap.killTweensOf(coinRef.current, "scale");
      gsap.fromTo(
        coinRef.current,
        { scale: increment ? 1.08 : 0.95, transformOrigin: "50% 50%" },
        {
          scale: 1,
          duration: 0.4,
          ease: "elastic.out(1, 0.5)",
          transformOrigin: "50% 50%",
        },
      );
    }
  };

  const cssVars = {
    "--empty-heart-lower": "var(--bg-color-mist)",
    "--empty-heart-upper": "var(--bg-color-blue-light)",
    "--face-color": "var(--foreground)",
    "--open-mouth-color": "var(--bg-color-brwan)",
    "--tongue-color": "var(--bg-color-blue)",
  } as React.CSSProperties;

  return (
    <div
      ref={hostRef}
      role="button"
      tabIndex={0}
      aria-label="Like button"
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onMouseMove={handleMouseMove}
      onKeyDown={(e) => {
        if (isCelebrating) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleAction(false);
        }
      }}
      onMouseEnter={() => {
        hoverInteractedRef.current = false;
        if (sadTimerRef.current) clearTimeout(sadTimerRef.current);
        if (clicksRef.current < HEART_MAX_CLICKS) setMouthState("happy");
      }}
      onMouseLeave={() => {
        handleMouseLeaveVisual();
        if (hoverInteractedRef.current) return;
        if (clicksRef.current >= HEART_MAX_CLICKS) return;

        setMouthState("sad");
        if (sadTimerRef.current) clearTimeout(sadTimerRef.current);

        // بعد الخروج بدون ضغط: ارجع للابتسامة بسلاسة بعد وقت.
        sadTimerRef.current = setTimeout(() => {
          if (
            !hoverInteractedRef.current &&
            !isCelebrating &&
            clicksRef.current < HEART_MAX_CLICKS
          ) {
            setMouthState("happy");
          }
        }, HOVER_LEAVE_RETURN_DELAY_MS);
      }}
      onClick={() => {
        if (isCelebrating) return;
        handleAction(true);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (isCelebrating) return;
        handleAction(false);
      }}
      className="relative shrink-0 cursor-pointer select-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        contain: "layout paint",
        background: "transparent",
        ...cssVars,
      }}
    >
      {canUseDOM
        ? createPortal(
            <div
              ref={particlesContainerRef}
              className="pointer-events-none"
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                overflow: "visible",
                zIndex: 200,
              }}
            />,
            document.body,
          )
        : null}

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "120px",
          height: "120px",
          transform: `scale(${scale})`,
          transformOrigin: "50% 50%",
        }}
      >
        <div className="relative" style={{ width: "120px", height: "120px" }}>
          <div className="absolute right-2 top-2 pointer-events-none z-30 flex flex-col items-end gap-1">
            {deltaText ? (
              <div
                ref={deltaLabelRef}
                className="font-black tracking-wider"
                style={{ fontSize: "30px", opacity: 0 }}
              >
                {deltaText}
              </div>
            ) : null}
          </div>

          {isFull ? (
            <div
              className="absolute pointer-events-none z-30 font-black uppercase"
              style={{
                bottom: "18px",
                right: "6px",
                fontSize: "20px",
                lineHeight: "1",
                color: "var(--bg-color-brwan)",
                textShadow: "0px 0px 25px rgba(85, 77, 77, 0.6)",
              }}
            >
              MAX
            </div>
          ) : null}

          <div
            ref={tiltRef}
            className="relative z-10 w-full h-full"
            style={{
              willChange: "transform",
              transformOrigin: "50% 50%",
            }}
          >
            <div
              ref={coinRef}
              className="w-full h-full"
              style={{ willChange: "transform", transformOrigin: "50% 50%" }}
            >
              <div
                className="w-full h-full"
                style={{
                  transform: `scale(${visualScale})`,
                  transformOrigin: "50% 50%",
                }}
              >
                <LikeButtonSVG
                  className="w-full h-full drop-shadow-2xl"
                  svgIds={svgIds}
                  isFull={isFull}
                  activeMaskPolygonRef={activeMaskPolygonRef}
                  mouthRef={mouthRef}
                  setEyesGroupRef={setEyesGroupRef}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
