import { create } from "zustand";

interface SupportState {
  isOpen: boolean;
  hasShown: boolean;
  openOverlay: (force?: boolean) => void;
  closeOverlay: () => void;
}

export const useSupportStore = create<SupportState>((set, get) => ({
  isOpen: false,
  hasShown: false,
  openOverlay: (force = false) => {
    if (!get().hasShown || force) {
      set({ isOpen: true, hasShown: true });
    }
  },
  closeOverlay: () => set({ isOpen: false }),
}));
