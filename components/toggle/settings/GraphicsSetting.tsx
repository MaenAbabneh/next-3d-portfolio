"use client";

import { useId } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useUISound } from "@/hooks/audio/useUISound";
import { MdAutoAwesome, MdSpeed } from "react-icons/md";

export function GraphicsSetting() {
  const { quality, toggleQuality } = useSettingsStore();
  const { playClick, playHover } = useUISound();
  const labelId = useId();

  const isHigh = quality === "high";

  return (
    <div className="flex items-center justify-between w-full px-2">
      <div className="flex flex-col">
        <span id={labelId} className="text-xl font-bold text-base-brwan">
          3D Quality
        </span>
        <span className="text-xs font-semibold opacity-60 text-base-brwan">
          {isHigh ? "High (Shadows On)" : "Low (Performance)"}
        </span>
      </div>
      <button
        type="button"
        onMouseEnter={playHover}
        onClick={() => {
          playClick();
          toggleQuality();
        }}
        role="switch"
        aria-checked={isHigh}
        aria-labelledby={labelId}
        className={`w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 active:scale-95 ${
          isHigh
            ? "bg-base-blue dark:bg-base-blue-dark"
            : "dark:bg-base-blue bg-base-blue-dark"
        }`}
      >
        <div
          className={`flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isHigh ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {isHigh ? (
            <MdAutoAwesome className="w-3.5 h-3.5 text-base-blue dark:text-base-blue-dark drop-shadow-sm" />
          ) : (
            <MdSpeed className="w-3.5 h-3.5 text-gray-500" />
          )}
        </div>
      </button>
    </div>
  );
}
