"use client";

import { useId } from "react";
import { useTheme } from "next-themes";
import { useUISound } from "@/hooks/audio/useUISound";
import { MdDarkMode, MdLightMode } from "react-icons/md";

export function ThemeSetting() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { playHover, playSwitchOn, playSwitchOff } = useUISound();
  const themeLabelId = useId();

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <div className="flex items-center justify-between w-full px-2">
      <span id={themeLabelId} className="text-xl font-bold text-base-brwan">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
      <button
        type="button"
        onMouseEnter={playHover}
        onClick={() => {
          if (isDark) {
            playSwitchOff();
          } else {
            playSwitchOn();
          }
          setTheme(isDark ? "light" : "dark");
        }}
        role="switch"
        aria-checked={isDark}
        aria-labelledby={themeLabelId}
        suppressHydrationWarning
        className={`w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 active:scale-95 ${
          isDark
            ? "bg-base-blue dark:bg-base-blue-dark"
            : "dark:bg-base-blue bg-base-blue-dark"
        }`}
      >
        <div
          className={`flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {isDark ? (
            <MdDarkMode className="w-3.5 h-3.5 text-base-blue dark:text-base-blue-dark drop-shadow-sm" />
          ) : (
            <MdLightMode className="w-3.5 h-3.5 text-gray-500" />
          )}
        </div>
      </button>
    </div>
  );
}
