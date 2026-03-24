import { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const useDeltaLabelAnimation = (params: {
  deltaText: "+1" | "-1" | null;
  deltaSeq: number;
  deltaLabelRef: RefObject<HTMLDivElement | null>;
}) => {
  const { deltaText, deltaSeq, deltaLabelRef } = params;

  useGSAP(
    () => {
      const el = deltaLabelRef.current;
      if (!el || !deltaText) return;

      gsap.killTweensOf(el);

      const isPositive = deltaText === "+1";
      const color = isPositive ? "#4ade80" : "#ef4444";
      const glow = isPositive
        ? "rgba(74, 222, 128, 0.5)"
        : "rgba(239, 68, 68, 0.5)";

      gsap.set(el, {
        opacity: 0,
        y: 20,
        scale: 0.5,
        color: color,
        textShadow: `0px 4px 15px ${glow}, 2px 2px 0px rgba(0,0,0,0.3)`,
      });

      const tl = gsap.timeline();
      tl.to(el, {
        opacity: 1,
        y: 0,
        scale: 1.2,
        duration: 0.4,
        ease: "back.out(3)",
      })
        .to(el, {
          scale: 1,
          duration: 0.15,
          ease: "power2.out",
        })
        .to(
          el,
          {
            y: -45,
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: "power2.in",
          },
          "+=0.2",
        );
    },
    { dependencies: [deltaSeq, deltaText], revertOnUpdate: true },
  );
};
