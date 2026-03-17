"use client";

import { Howl } from "howler";
import { useSoundStore } from "@/store/useSoundStore";

const hoverSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773774578/hover-tick_mozjdd.wav",
  ],
  volume: 0.5,
});

const clickSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773774577/click-pop_fc2qxe.ogg",
  ],
  volume: 0.3,
});

const exitSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773774578/exit-swoosh_upsgno.mp3",
  ],
  volume: 0.2,
});

export function useUISound() {
  const playHover = () => {
    if (useSoundStore.getState().sfxMuted) return;

    if (!hoverSound.playing()) {
      hoverSound.play();
    }
  };

  const playClick = () => {
    if (useSoundStore.getState().sfxMuted) return;
    clickSound.play();
  };

  const playExit = () => {
    if (useSoundStore.getState().sfxMuted) return;
    exitSound.play();
  };

  return { playHover, playClick, playExit };
}
