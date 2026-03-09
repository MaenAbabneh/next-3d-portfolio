import { create } from "zustand";

interface GameState {
  started: boolean;
  setStarted: (value: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  started: false,
  setStarted: (value) => set({ started: value }),
}));
