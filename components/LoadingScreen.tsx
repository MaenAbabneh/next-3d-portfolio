"use client";

import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGameStore } from "@/store/useGameStore";
import { useUISound } from "@/hooks/audio/useUISound";

interface LoadingScreenProps {
  onStarted: (withSound: boolean) => void;
}

export const LoadingScreen = ({ onStarted }: LoadingScreenProps) => {
  const { progress } = useProgress();
  const isLoaded = progress === 100;
  const started = useGameStore((s) => s.started);

  const containerRef = useRef<HTMLDivElement>(null);

  const [isEntering, setIsEntering] = useState(false);

  const { contextSafe } = useGSAP();
  const { playHover } = useUISound();

  const handleEnter = (withSound: boolean) => {
    if (isEntering) return;
    setIsEntering(true);

    contextSafe(() => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => {
          onStarted(withSound);
        },
      });

      tl.to(containerRef.current, {
        scale: 0.5,
        duration: 1.2,
        delay: 0.25,
        ease: "back.in(1.8)",
      }).to(
        containerRef.current,
        {
          y: "200vh",
          rotationX: 45,
          rotationY: -35,
          perspective: 1000,
          duration: 1.2,
          ease: "back.in(1.8)",
        },
        "-=0.1",
      );
    })();
  };

  if (started) return null;

  return (
    <div
      ref={containerRef}
      className="-inset-5 fixed z-999999 flex flex-col items-center justify-center overflow-hidden bg-base-cream dark:bg-base-blue-light border-8 md:border-16 border-base-blue dark:border-base-blue-dark rounded-4xl origin-center"
    >
      <div className="flex flex-col items-center justify-center z-10 w-full px-4">
        <button
          onClick={() => isLoaded && handleEnter(true)}
          disabled={!isLoaded || isEntering}
          onMouseEnter={() => {
            if (isLoaded && !isEntering) playHover();
          }}
          aria-label={isLoaded ? "Enter the portfolio" : "Loading"}
          className={`
            relative px-8 py-4 md:px-16 md:py-6 
            text-3xl sm:text-4xl md:text-6xl rounded-2xl md:rounded-3xl outline-none
            transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            font-bold font-serif text-base-brwan border-solid 
            border-[6px] md:border-12 border-base-blue dark:border-base-blue-dark 
            bg-base-cream dark:bg-base-blue-light
            w-auto max-w-full truncate
            
            ${!isEntering ? "shadow-[0px_3px_8px_rgba(0,0,0,0.24)]" : ""}
            ${!isLoaded && !isEntering ? "cursor-wait opacity-80" : ""}
            ${isLoaded && !isEntering ? "cursor-pointer hover:scale-[1.1]" : ""}

            ${isEntering ? "bg-var(--color-base-cream) dark:bg-var(--color-base-blue-light) text-var(--color-base-brwan) border-var(--color-base-blue) dark:border-var(--color-base-blue-dark) border-4 md:border-8 cursor-default shadow-none!" : ""}
          `}
        >
          {isEntering ? "~ 안녕하세요 ~" : isLoaded ? "Enter!" : `Loading...`}
        </button>
      </div>

      <div className="absolute bottom-6 md:bottom-12 flex flex-col items-center gap-2 w-full px-6 z-20">
        {isLoaded && !isEntering && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter(false);
            }}
            className="bg-transparent border-none text-base-brwan text-sm md:text-lg hover:text-base-brwan/60 cursor-pointer font-serif transition-colors pointer-events-auto mb-10"
            aria-label="Enter without Sound"
          >
            Enter without Sound :(
          </button>
        )}

        <div className="text-center text-base-brwan opacity-90 font-mono text-xs sm:text-sm md:text-xl pointer-events-none w-full">
          <p className="hidden md:block m-0">
            use left/right click and mouse wheel to navigate!
          </p>
          <p className="block md:hidden m-0">
            use one or two fingers to navigate!
          </p>
        </div>
      </div>
    </div>
  );
};
