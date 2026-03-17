"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SoundState = {
  bgmMuted: boolean;
  sfxMuted: boolean;
  bgmVolume: number;
  hasHydrated: boolean;
  pianoMuted: boolean;
  pianoVolume: number;
  trackIndex: number;

  toggleBgm: () => void;
  toggleSfx: () => void;
  setBgmMuted: (value: boolean) => void;
  setSfxMuted: (value: boolean) => void;
  setBgmVolume: (value: number) => void;
  setHasHydrated: (value: boolean) => void;
  togglePiano: () => void;
  setPianoVolume: (val: number) => void;
  nextTrack: () => void;
};

export const useSoundStore = create<SoundState>()(
  persist(
    (set, get) => ({
      bgmMuted: false,
      sfxMuted: false,
      bgmVolume: 0.05,
      hasHydrated: false,
      pianoMuted: false,
      pianoVolume: 0.5,
      trackIndex: 0,

      toggleBgm: () => set({ bgmMuted: !get().bgmMuted }),
      toggleSfx: () => set({ sfxMuted: !get().sfxMuted }),
      togglePiano: () => set((state) => ({ pianoMuted: !state.pianoMuted })),

      setPianoVolume: (val) => set({ pianoVolume: val }),
      setBgmMuted: (value) => set({ bgmMuted: value }),
      setSfxMuted: (value) => set({ sfxMuted: value }),
      setBgmVolume: (value) => set({ bgmVolume: value }),
      nextTrack: () => set((state) => ({ trackIndex: state.trackIndex + 1 })),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "portfolio:sounds",
      partialize: (state) => ({
        bgmMuted: state.bgmMuted,
        sfxMuted: state.sfxMuted,
        bgmVolume: state.bgmVolume,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    },
  ),
);
