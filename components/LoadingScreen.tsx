"use client";

import { useProgress } from "@react-three/drei";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface LoadingScreenProps {
  onStarted: (withSound: boolean) => void;
}

export const LoadingScreen = ({ onStarted }: LoadingScreenProps) => {
  const { progress } = useProgress();
  const isLoaded = progress === 100;
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP();

  const handleEnter = (withSound: boolean) => {
    if (!containerRef.current || !buttonRef.current) return;

    buttonRef.current.textContent = "~ 안녕하세요 ~";

    buttonRef.current.style.backgroundColor = "";
    buttonRef.current.style.color = "";
    buttonRef.current.style.border = "";
    buttonRef.current.style.boxShadow = "none";

    buttonRef.current.classList.add(
      "bg-var(--color-base-cream)",
      "dark:bg-var(--color-base-blue-light)", // الخلفية
      "text-var(--color-base-brwan)",
      "border-var(--color-base-blue)",
      "dark:border-var(--color-base-blue-dark)", // الإطار
      "border-8",
      "cursor-default",
    );

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

  return (
    <div
      ref={containerRef}
      className="-inset-5 fixed z-999999 flex flex-col items-center justify-center overflow-hidden bg-base-cream dark:bg-base-blue-light border-10 border-base-blue dark:border-base-blue-dark rounded-4xl origin-center"
    >
      <button
        ref={buttonRef}
        onClick={() => isLoaded && handleEnter(true)}
        disabled={!isLoaded}
        className={`
          relative px-16 py-6 text-4xl md:text-6xl rounded-3xl outline-none
          transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          font-bold font-serif border-12 text-base-brwan border-solid border-base-blue dark:border-base-blue-dark bg-base-cream dark:bg-base-blue-light
          shadow-[0px_3px_8px_rgba(0,0,0,0.24)]
          ${!isLoaded ? "cursor-wait " : "cursor-pointer hover:scale-[1.1]"}
        `}
      >
        {isLoaded ? "Enter!" : `Loading...`}
      </button>

      {isLoaded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEnter(false);
          }}
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2 bg-transparent border-none text-base-brwan  text-xl hover:text-base-brwan/80 cursor-pointer font-serif transition-colors"
          aria-label="Enter without Sound"
        >
          Enter without Sound :(
        </button>
      )}

      <div className="absolute bottom-25 text-center text-base-brwan opacity-90 font-mono text-xl px-4">
        <p className="hidden md:block">
          use left/right click and mouse wheel to navigate!
        </p>
        <p className="block md:hidden">use one or two fingers to navigate!</p>
      </div>
    </div>
  );
};
