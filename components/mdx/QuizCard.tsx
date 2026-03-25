"use client";

import { useState, useRef } from "react";
import { IoHardwareChipOutline, IoKeyOutline } from "react-icons/io5";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function QuizCard({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isRevealed && answerRef.current) {
      gsap.fromTo(
        answerRef.current,
        { opacity: 0, y: -10, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
          ease: "power2.out",
        },
      );
    }
  }, [isRevealed]);

  return (
    <div className="my-8 rounded-xl border-4 border-dashed border-base-blue bg-black/5 dark:bg-white/5 p-1">
      <div className="bg-base-blue/10 p-5 rounded-lg">
        <div className="flex items-center gap-3 mb-4 text-base-blue-dark dark:text-base-blue">
          <IoHardwareChipOutline size={26} className="animate-pulse" />
          <p className="font-mono font-black text-lg uppercase tracking-widest">
            System Challenge
          </p>
        </div>

        <p className="text-base-brwan font-medium mb-4">{question}</p>

        {!isRevealed ? (
          <button
            onClick={() => setIsRevealed(true)}
            className="w-full py-3 bg-base-blue text-white font-mono font-bold uppercase tracking-widest rounded-md hover:bg-base-blue-dark transition-colors border-2 border-black/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
          >
            Reveal Output
          </button>
        ) : (
          <div
            ref={answerRef}
            className="mt-4 p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-md flex gap-3 items-start"
          >
            <IoKeyOutline
              size={22}
              className="text-emerald-600 shrink-0 mt-0.5"
            />
            <div className="text-sm font-mono text-base-brwan">{answer}</div>
          </div>
        )}
      </div>
    </div>
  );
}
