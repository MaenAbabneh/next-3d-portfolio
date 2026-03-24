import { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const useFullBounce = (params: {
  isFull: boolean;
  coinRef: RefObject<HTMLDivElement | null>;
  tiltRef: RefObject<HTMLDivElement | null>;
  onCelebrationChange?: (isCelebrating: boolean) => void;
  jumpPx?: number;
  rotationDeg?: number;
}) => {
  const {
    isFull,
    coinRef,
    tiltRef,
    onCelebrationChange,
    jumpPx = 80,
    rotationDeg = 15,
  } = params;

  useGSAP(
    () => {
      if (!isFull) return;
      if (!coinRef.current) return;

      onCelebrationChange?.(true);

      gsap.killTweensOf(coinRef.current, "y,rotation");
      if (tiltRef.current) {
        gsap.killTweensOf(tiltRef.current, "rotation");
        gsap.set(tiltRef.current, { rotation: 0 });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          onCelebrationChange?.(false);
        },
      });

      tl.to(coinRef.current, {
        y: -jumpPx,
        rotation: rotationDeg,
        duration: 0.25,
        ease: "power2.out",
      })
        .to(coinRef.current, {
          y: 0,
          rotation: 0,
          duration: 0.25,
          ease: "power2.in",
        })
        .to(coinRef.current, {
          y: -jumpPx,
          rotation: -rotationDeg,
          duration: 0.25,
          ease: "power2.out",
        })
        .to(coinRef.current, {
          y: 0,
          rotation: 0,
          duration: 0.25,
          ease: "power2.in",
        });

      return () => {
        tl.kill();
        onCelebrationChange?.(false);
        if (coinRef.current) {
          gsap.killTweensOf(coinRef.current, "y,rotation");
          gsap.set(coinRef.current, { y: 0, rotation: 0 });
        }
        if (tiltRef.current) {
          gsap.killTweensOf(tiltRef.current, "rotation");
          gsap.set(tiltRef.current, { rotation: 0 });
        }
      };
    },
    { dependencies: [isFull] }
  );
};
