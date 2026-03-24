"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

import CoinSVG from "../Icons/CoinSVG";
import {
  DECREMENT_RETURN_DELAY_MS,
  FILL_GEOMETRY,
  HOVER_LEAVE_RETURN_DELAY_MS,
  LIQUID_GEOMETRY,
  MAX_CLICKS,
  MouthState,
} from "@/constant/coinConstants";

import { useCoinSvgIds } from "../../constant/useCoinSvgIds";
import { useDeltaLabelAnimation } from "../../hooks/animations/wackyCoin/useDeltaLabelAnimation";
import { useFullParticles } from "../../hooks/animations/wackyCoin/useFullParticles";
import { useFullBounce } from "../../hooks/animations/wackyCoin/useFullBounce";
import { useWackyCoinTilt } from "../../hooks/animations/wackyCoin/useWackyCoinTilt";
import { useMouthMorph } from "../../hooks/animations/wackyCoin/useMouthMorph";

type WackyCoinProps = {
  size?: number;
  onClicksChange?: (clicks: number) => void;
};

export default function WackyCoin({
  size = 500,
  onClicksChange,
}: WackyCoinProps) {
  const [clicks, setClicks] = useState(0);
  const [mouthState, setMouthState] = useState<MouthState>("sad");
  const [deltaText, setDeltaText] = useState<"+1" | "-1" | null>(null);
  const [deltaSeq, setDeltaSeq] = useState(0);
  const [isCelebrating, setIsCelebrating] = useState(false);

  const clicksRef = useRef(0);

  // outer: 2D rotate container, inner: scale/pulse container
  const tiltRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const fillRectRef = useRef<SVGRectElement>(null);
  const liquidGroupRef = useRef<SVGGElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const sadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const hoverInteractedRef = useRef(false);

  const deltaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deltaLabelRef = useRef<HTMLDivElement>(null);

  const svgIds = useCoinSvgIds();

  const isFull = clicks === MAX_CLICKS;

  useDeltaLabelAnimation({ deltaText, deltaSeq, deltaLabelRef });
  useFullParticles({ isFull, particlesContainerRef, yOffsetPx: -16 });
  useFullBounce({
    isFull,
    coinRef,
    tiltRef,
    onCelebrationChange: setIsCelebrating,
  });

  const { setEyesGroupRef, handleMouseMove, handleMouseLeaveVisual } =
    useWackyCoinTilt({ isFull, tiltRef, liquidGroupRef });

  useMouthMorph({ isFull, mouthState, mouthRef });

  useEffect(() => {
    return () => {
      if (deltaTimerRef.current) clearTimeout(deltaTimerRef.current);
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
    return size / 500;
  }, [size]);

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
    if (fillRectRef.current) {
      gsap.set(fillRectRef.current, {
        attr: { y: FILL_GEOMETRY.BOTTOM_Y + LIQUID_GEOMETRY.FILL_EPSILON },
      });
    }

    // ثبّت نقطة الأصل للتحويل حتى لا يظهر أي shifting أثناء النبض/الميلان.
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

    // keep portal-aligned when the ModalLayout scrolls or viewport changes
    scrollParent?.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);

    return () => {
      scrollParent?.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, [canUseDOM]);

  useEffect(() => {
    return () => {
      if (sadTimerRef.current) clearTimeout(sadTimerRef.current);
    };
  }, []);

  const handleAction = (increment: boolean) => {
    if (isCelebrating) return;
    hoverInteractedRef.current = true;
    const currentClicks = clicksRef.current;

    if (increment && currentClicks >= MAX_CLICKS) return;

    const newClicks = increment
      ? Math.min(currentClicks + 1, MAX_CLICKS)
      : Math.max(currentClicks - 1, 0);

    clicksRef.current = newClicks;
    setClicks(newClicks);
    setMouthState(increment ? "happy" : "sad");

    // اقفل التفاعل فورًا عند الوصول للحد الأقصى حتى لا تُقطع حركة الاحتفال.
    if (increment && newClicks === MAX_CLICKS) setIsCelebrating(true);

    // إشعار +1 / -1 (ثابت في الزاوية اليمنى)
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
    // عند الإنقاص (right-click) اعرض الحزن مؤقتًا ثم ارجع للابتسامة
    if (!increment) {
      sadTimerRef.current = setTimeout(() => {
        if (clicksRef.current < MAX_CLICKS) setMouthState("happy");
      }, DECREMENT_RETURN_DELAY_MS);
    }

    if (fillRectRef.current) {
      gsap.killTweensOf(fillRectRef.current);
      gsap.to(fillRectRef.current, {
        attr: {
          y:
            FILL_GEOMETRY.BOTTOM_Y +
            LIQUID_GEOMETRY.FILL_EPSILON -
            (FILL_GEOMETRY.TOTAL_HEIGHT + LIQUID_GEOMETRY.FILL_EPSILON) *
              (newClicks / MAX_CLICKS),
        },
        duration: 0.6,
        ease: "back.out(1.2)",
      });
    }

    // حركة نبض عند النقر
    if (coinRef.current) {
      // لا تقتل تويينات الاحتفال (y/rotation) عند الامتلاء
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

  return (
    <div
      ref={hostRef}
      role="button"
      tabIndex={0}
      aria-label="Glass gold coin"
      onMouseDown={(e) => {
        // Prevent mouse-driven focus to avoid browser auto-scroll (scrollIntoView)
        // when this component lives inside a scrollable container (e.g. ModalLayout).
        e.preventDefault();
      }}
      onMouseMove={handleMouseMove}
      onKeyDown={(e) => {
        if (isCelebrating) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleAction(true);
        }
      }}
      onMouseEnter={() => {
        hoverInteractedRef.current = false;
        if (sadTimerRef.current) clearTimeout(sadTimerRef.current);

        // وهو فارغ (0) يبتسم عند التحويم
        if (clicksRef.current === 0) setMouthState("happy");
      }}
      onMouseLeave={() => {
        handleMouseLeaveVisual();
        // عند الخروج بدون ضغط: يحزن ثم يعود للابتسام بنفس المؤقت
        if (hoverInteractedRef.current) return;
        if (clicksRef.current !== 0) return;

        setMouthState("sad");
        if (sadTimerRef.current) clearTimeout(sadTimerRef.current);
        sadTimerRef.current = setTimeout(() => {
          if (clicksRef.current === 0 && clicksRef.current < MAX_CLICKS) {
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
      className="relative shrink-0 cursor-pointer select-none overflow-hidden"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        contain: "layout paint",
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
          width: "500px",
          height: "500px",
          transform: `scale(${scale})`,
          transformOrigin: "50% 50%",
        }}
      >
        <div
          className="relative"
          style={{
            width: "500px",
            height: "500px",
          }}
        >
          {/* إشعار +1 / -1 (ثابت في الزاوية اليمنى العلوية) */}
          <div className="absolute right-8 top-8 pointer-events-none z-30 flex flex-col items-end gap-1">
            {deltaText ? (
              <div
                ref={deltaLabelRef}
                className="font-black tracking-wider"
                style={{ fontSize: "42px", opacity: 0 }}
              >
                {deltaText}
              </div>
            ) : null}
          </div>

          {/* كلمة max (ثابتة في الزاوية اليمنى السفلية بجانب العملة) */}
          {isFull ? (
            <div
              className="absolute pointer-events-none z-30 font-black uppercase"
              style={{
                bottom: "100px",
                right: "60px",
                fontSize: "35px",
                lineHeight: "1",
                color: "#554d4d",
                textShadow:
                  "0px 0px 25px rgba(85, 77, 77, 0.6), 6px 6px 0px rgba(0, 0, 0, 0.8)",
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
              <CoinSVG
                svgIds={svgIds}
                isFull={isFull}
                fillRectRef={fillRectRef}
                liquidGroupRef={liquidGroupRef}
                mouthRef={mouthRef}
                setEyesGroupRef={setEyesGroupRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
