import { useEffect, useRef } from "react"; // 🌟 أزلنا useState
import { Howl } from "howler";
import { useGameStore } from "@/store/useGameStore";
import { useSoundStore } from "@/store/useSoundStore";

const MUSIC_TRACKS = [
  // "/sounds/track1-lofi.mp3",
  // "/sounds/track2-cozy-rpg.mp3",
  // "/sounds/track3-8bit.mp3",
  "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773774579/track4-RBG_Adv_hl77ea.mp3",
  "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3,q_auto/v1773774580/track5-epic-adventure_ta1ls7.mp3",
];

export function useBackgroundMusic() {
  const started = useGameStore((s) => s.started);
  const bgmVolume = useSoundStore((s) => s.bgmVolume);
  const bgmMuted = useSoundStore((s) => s.bgmMuted);

  const trackIndex = useSoundStore((s) => s.trackIndex);
  const nextTrack = useSoundStore((s) => s.nextTrack);

  const isPianoZoomed = useGameStore((s) => s.isPianoZoomed);
  const isScreenZoomed = useGameStore((s) => s.isScreenZoomed);

  const soundRef = useRef<Howl | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrackIndex = trackIndex % MUSIC_TRACKS.length;

  useEffect(() => {
    const sound = new Howl({
      src: [MUSIC_TRACKS[currentTrackIndex]],
      volume: 0,
      html5: false,
      preload: true,
      onend: () => {
        nextTrack();
      },
    });

    soundRef.current = sound;

    const store = useGameStore.getState();
    const soundStore = useSoundStore.getState();
    if (
      store.started &&
      !soundStore.bgmMuted &&
      !store.isPianoZoomed &&
      !store.isScreenZoomed
    ) {
      sound.play();
      sound.fade(0, soundStore.bgmVolume, 1500);
    }

    return () => {
      sound.unload();
    };
  }, [currentTrackIndex, nextTrack]);

  useEffect(() => {
    if (soundRef.current && soundRef.current.playing() && !bgmMuted) {
      soundRef.current.volume(bgmVolume);
    }
  }, [bgmVolume, bgmMuted]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;

    const shouldPlay =
      started && !bgmMuted && !isPianoZoomed && !isScreenZoomed;

    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    if (shouldPlay) {
      if (!sound.playing()) sound.play();

      const currentVol =
        typeof sound.volume() === "number" ? sound.volume() : 0;
      sound.fade(currentVol as number, bgmVolume, 1500);
    } else {
      if (sound.playing()) {
        const currentVol =
          typeof sound.volume() === "number" ? sound.volume() : bgmVolume;
        sound.fade(currentVol as number, 0, 1000);

        pauseTimeoutRef.current = setTimeout(() => {
          sound.pause();
        }, 1000);
      }
    }
  }, [
    started,
    bgmMuted,
    isPianoZoomed,
    isScreenZoomed,
    currentTrackIndex,
    bgmVolume,
  ]);
}
