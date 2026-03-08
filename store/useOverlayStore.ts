import { create } from "zustand";

type SectionType = "about" | "works" | "contact" | "articles" | null;

interface OverlayState {
  isOpen: boolean;
  section: SectionType;
  openOverlay: (section: SectionType) => void;
  closeOverlay: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  isOpen: false,
  section: null,
  openOverlay: (section) => set({ isOpen: true, section }),
  closeOverlay: () => set({ isOpen: false }),
}));
