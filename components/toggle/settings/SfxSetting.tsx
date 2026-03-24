"use client";

import { useId } from "react";
import { useSoundStore } from "@/store/useSoundStore";
import { useUISound } from "@/hooks/audio/useUISound";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";

export function SfxSetting() {
  const { sfxMuted, toggleSfx } = useSoundStore();
  const { playClick, playHover, playDisabled } = useUISound();
  const sfxLabelId = useId();

  return (
    <div className="flex items-center justify-between w-full px-2">
      <span id={sfxLabelId} className="text-xl font-bold text-base-brwan">
        Effects (SFX)
      </span>
      <button
        type="button"
        onMouseEnter={playHover}
        onClick={() => {
          if (sfxMuted) {
            playClick();
          } else {
            playDisabled();
          }
          toggleSfx();
        }}
        role="switch"
        aria-checked={!sfxMuted}
        aria-labelledby={sfxLabelId}
        className={`w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 active:scale-95 ${
          !sfxMuted ? "bg-base-blue dark:bg-base-blue-dark" : "bg-gray-400"
        }`}
      >
        <div
          className={`flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            !sfxMuted ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {!sfxMuted ? (
            <MdVolumeUp className="w-4 h-4 text-base-blue dark:text-base-blue-dark drop-shadow-sm" />
          ) : (
            <MdVolumeOff className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>
    </div>
  );
}
