import { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PARTICLE_SVGS } from "@/constant/coinConstants";

export const useFullParticles = (params: {
  isFull: boolean;
  particlesContainerRef: RefObject<HTMLDivElement | null>;
  particleCount?: number;
  distancePx?: number;
  minDistancePx?: number;
  maxDistancePx?: number;
  yOffsetPx?: number;
}) => {
  const {
    isFull,
    particlesContainerRef,
    particleCount: particleCountProp,
    distancePx,
    minDistancePx,
    maxDistancePx,
    yOffsetPx,
  } = params;

  useGSAP(
    () => {
      if (!isFull) return;
      if (!particlesContainerRef.current) return;

      const container = particlesContainerRef.current;

      const particleCount = particleCountProp ?? 5;

      const centerX = container.clientWidth / 2;
      const centerY = container.clientHeight / 2;
      const startRadius = Math.min(centerX, centerY) * 0.72;
      const angleStep = (Math.PI * 2) / particleCount;

      for (let i = 0; i < particleCount; i++) {
        const img = document.createElement("img");
        img.src = PARTICLE_SVGS[i % PARTICLE_SVGS.length];
        img.className = "absolute w-6 h-6 object-contain pointer-events-none";

        const angle = i * angleStep;

        const startX = centerX + Math.cos(angle) * startRadius;
        const startY = centerY + Math.sin(angle) * startRadius;

        img.style.top = `${startY}px`;
        img.style.left = `${startX}px`;
        img.style.transform = "translate(-50%, -50%)";

        container.appendChild(img);

        const safeDistancePx = Number.isFinite(distancePx) ? distancePx : null;

        const minPx = Number.isFinite(minDistancePx)
          ? (minDistancePx as number)
          : 20;
        const maxPx = Number.isFinite(maxDistancePx)
          ? (maxDistancePx as number)
          : minPx;

        // Deterministic distance: either fixed, or interpolated across particles.
        const t = particleCount <= 1 ? 0 : i / (particleCount - 1);
        const velocity = safeDistancePx ?? minPx + (maxPx - minPx) * t;
        const destX = Math.cos(angle) * velocity;
        const destY = Math.sin(angle) * velocity + (yOffsetPx ?? 0);

        const randomRotation = (Math.random() - 0.5) * 720;
        const moveDuration = 0.8 + Math.random() * 0.6;

        gsap.set(img, { x: 0, y: 0, scale: 0.1, opacity: 1, rotation: 0 });

        const tl = gsap.timeline({
          onComplete: () => {
            img.remove();
          },
        });

        tl.to(img, {
          x: destX,
          y: destY,
          scale: Math.random() * 1.4 + 0.6,
          rotation: randomRotation,
          duration: moveDuration,
          ease: "power2.out",
        }).to(img, {
          opacity: 0,
          scale: "+=0.2",
          duration: 0.3,
          ease: "power1.inOut",
        });
      }

      return () => {
        container.replaceChildren();
      };
    },
    { dependencies: [isFull] },
  );
};
