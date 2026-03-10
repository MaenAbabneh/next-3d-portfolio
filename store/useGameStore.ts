import { create } from "zustand";

interface GameState {
  started: boolean;
  isScreenZoomed: boolean;
  isCameraUnlocked: boolean;
  setStarted: (value: boolean) => void;
  setIsScreenZoomed: (isZoomed: boolean) => void;
  setIsCameraUnlocked: (unlocked: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  started: false,
  isScreenZoomed: false,
  isCameraUnlocked: false,
  setStarted: (value) => set({ started: value }),
  setIsScreenZoomed: (isZoomed) => set({ isScreenZoomed: isZoomed }),
  setIsCameraUnlocked: (unlocked) => set({ isCameraUnlocked: unlocked }),
}));
