"use client";

import { useId } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useUISound } from "@/hooks/audio/useUISound";

export function LanguageSetting() {
  const { language, toggleLanguage } = useSettingsStore();
  const { playClick, playHover } = useUISound();
  const labelId = useId();

  const isEn = language === "en";

  return (
    <div className="flex items-center justify-between w-full px-2">
      <span id={labelId} className="text-xl font-bold text-base-brwan">
        Language
      </span>
      <button
        type="button"
        onMouseEnter={playHover}
        onClick={() => {
          playClick();
          toggleLanguage();
        }}
        role="switch"
        aria-checked={isEn}
        aria-labelledby={labelId}
        className="w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 active:scale-95 bg-base-blue dark:bg-base-blue-dark relative"
      >
        <div
          className={`w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-base-blue dark:text-base-blue-dark transform shadow-md transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isEn ? "translate-x-6" : "translate-x-0"}`}
        >
          {isEn ? "EN" : "AR"}
        </div>
      </button>
    </div>
  );
}
