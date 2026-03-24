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
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773943467/pop_s8jg5e.mp3",
  ],
  volume: 0.3,
});

const exitSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773774578/exit-swoosh_upsgno.mp3",
  ],
  volume: 0.2,
});

const glugSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773943467/glug-b_mtggzq.mp3",
  ],
  volume: 0.4,
});

const fanFareSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773943467/fanfare_zkzjmv.mp3",
  ],
  volume: 0.5,
});

const switchOnSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773943467/switch-on_shryj3.mp3",
  ],
  volume: 0.5,
});

const switchOffSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773943467/switch-off_iuunnh.mp3",
  ],
  volume: 0.5,
});

const disabledSound = new Howl({
  src: [
    "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773947091/disable-sound_q9ziqx.mp3",
  ],
  volume: 0.5,
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

  const playGlug = () => {
    if (useSoundStore.getState().sfxMuted) return;
    glugSound.play();
  };

  const playFanfare = () => {
    if (useSoundStore.getState().sfxMuted) return;
    fanFareSound.play();
  };

  const playSwitchOn = () => {
    if (useSoundStore.getState().sfxMuted) return;
    switchOnSound.play();
  };

  const playSwitchOff = () => {
    if (useSoundStore.getState().sfxMuted) return;
    switchOffSound.play();
  };

  const playDisabled = () => {
    if (useSoundStore.getState().sfxMuted) return;
    disabledSound.play();
  };

  return {
    playHover,
    playClick,
    playExit,
    playGlug,
    playFanfare,
    playSwitchOn,
    playSwitchOff,
    playDisabled,
  };
}
