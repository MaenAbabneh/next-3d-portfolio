"use client";

import { useSoundStore } from "@/store/useSoundStore";
import { useUISound } from "@/hooks/audio/useUISound";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/utils/cn";
import { IoPlaySkipForward } from "react-icons/io5";
import { TbMusicOff, TbMusic } from "react-icons/tb";

export function BgmSetting() {
  const { bgmMuted, toggleBgm, bgmVolume, setBgmVolume, nextTrack } =
    useSoundStore();
  const { playClick, playHover, playDisabled } = useUISound();

  const volumeRatio = bgmVolume / 0.3;
  const thumbSize = 10 + volumeRatio * 14;

  return (
    <div className="flex flex-col gap-3 w-full px-2">
      <div className="flex items-center justify-between w-full">
        <span className="text-xl font-bold text-base-brwan">Music (BGM)</span>

        <div className="flex items-center gap-3">
          <Switch.Root
            checked={!bgmMuted}
            onCheckedChange={() => {
              if (bgmMuted) {
                playClick();
              } else {
                playDisabled();
              }
              toggleBgm();
            }}
            onMouseEnter={playHover}
            className={cn(
              "w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 active:scale-95",
              !bgmMuted ? "bg-base-blue dark:bg-base-blue-dark" : "bg-gray-400",
            )}
          >
            <Switch.Thumb
              className={cn(
                "flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                !bgmMuted ? "translate-x-6" : "translate-x-0",
              )}
            >
              {!bgmMuted ? (
                <TbMusic className="w-3.5 h-3.5 text-base-blue dark:text-base-blue-dark drop-shadow-sm" />
              ) : (
                <TbMusicOff className="w-3.5 h-3.5 text-gray-500" />
              )}
            </Switch.Thumb>
          </Switch.Root>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-4 transition-opacity duration-300",
          bgmMuted && "opacity-50 pointer-events-none",
        )}
      >
        <Slider.Root
          className="relative flex items-center w-full h-8 touch-none select-none mt-2 group"
          value={[bgmVolume]}
          onValueChange={(val) => setBgmVolume(val[0])}
          max={0.3}
          step={0.01}
        >
          <Slider.Track
            className="relative grow h-full bg-base-blue/20 dark:bg-white/20 rounded-r-sm overflow-hidden cursor-pointer"
            style={{ clipPath: "polygon(0 40%, 100% 0%, 100% 100%, 0 60%)" }}
          >
            <Slider.Range className="absolute h-full bg-base-blue dark:bg-base-blue-dark" />
          </Slider.Track>

          <Slider.Thumb
            className="block bg-base-blue dark:bg-base-blue-dark rounded-full shadow-[0_0_0_4px_rgba(0,0,0,0)] transition-all duration-200 group-hover:shadow-base-blue/20 outline-none cursor-grab active:cursor-grabbing top-1/2  active:scale-[1.2]"
            aria-label="Volume"
            style={{
              width: `${thumbSize}px`,
              height: `${thumbSize}px`,
            }}
          />
        </Slider.Root>
        <button
          type="button"
          onClick={() => {
            playClick();
            nextTrack();
          }}
          onMouseEnter={playHover}
          disabled={bgmMuted}
          className={cn(
            "p-2 rounded-full transition-all duration-300 active:scale-90 flex items-center justify-center",
            bgmMuted
              ? "opacity-50 cursor-not-allowed text-gray-400"
              : "hover:bg-base-blue/10 dark:hover:bg-white/10 text-base-blue dark:text-base-blue-dark",
          )}
          aria-label="Next Track"
        >
          <IoPlaySkipForward className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
