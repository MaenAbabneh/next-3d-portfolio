"use client";

import { Howler } from "howler";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SoundState = {
  muted: boolean;
  hasHydrated: boolean;
  setMuted: (value: boolean) => void;
  toggleMuted: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useSoundStore = create<SoundState>()(
  persist(
    (set, get) => ({
      muted: false,
      hasHydrated: false,

      setMuted: (value) => {
        set({ muted: value });
        Howler.mute(value);
      },

      toggleMuted: () => {
        const next = !get().muted;
        set({ muted: next });
        Howler.mute(next);
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "portfolio:muted",

      partialize: (state) => ({ muted: state.muted }),

      onRehydrateStorage: () => (state) => {
        if (state) {
          Howler.mute(state.muted);
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
