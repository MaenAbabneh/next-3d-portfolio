"use client";

import { useId, useState, useEffect } from "react";
import { useUISound } from "@/hooks/audio/useUISound";
// 🌟 1. استيراد أيقونات تكبير وتصغير الشاشة
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

export function FullscreenSetting() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { playClick, playHover } = useUISound();
  const labelId = useId();

  useEffect(() => {
    const onFullscreenChange = () =>
      setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .catch((err) => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex items-center justify-between w-full px-2">
      <span id={labelId} className="text-xl font-bold text-base-brwan">
        Fullscreen
      </span>
      <button
        type="button"
        onMouseEnter={playHover}
        onClick={toggleFullscreen}
        role="switch"
        aria-checked={isFullscreen}
        aria-labelledby={labelId}
        className={`w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 active:scale-95 ${
          isFullscreen ? "bg-base-blue dark:bg-base-blue-dark" : "bg-gray-400"
        }`}
      >
        <div
          className={`flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isFullscreen ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {isFullscreen ? (
            <MdFullscreenExit className="w-4 h-4 text-base-blue dark:text-base-blue-dark drop-shadow-sm" />
          ) : (
            <MdFullscreen className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>
    </div>
  );
}
