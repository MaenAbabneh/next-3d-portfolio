import { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MOUTH_PATHS, MouthState } from "@/constant/coinConstants";

export const useMouthMorph = (params: {
  isFull: boolean;
  mouthState: MouthState;
  mouthRef: RefObject<SVGPathElement | null>;
  mouthPaths?: Record<MouthState, string>;
}) => {
  const { isFull, mouthState, mouthRef, mouthPaths = MOUTH_PATHS } = params;

  useGSAP(
    () => {
      if (isFull) return;
      if (!mouthRef.current) return;

      gsap.killTweensOf(mouthRef.current);
      gsap.to(mouthRef.current, {
        attr: { d: mouthPaths[mouthState] },
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: true,
      });
    },
    { dependencies: [mouthState, isFull] },
  );
};
