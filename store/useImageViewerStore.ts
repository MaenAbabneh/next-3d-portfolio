import { create } from "zustand";

let closeTimeout: ReturnType<typeof setTimeout> | null = null;

interface ImageViewerState {
  isOpen: boolean;
  activeImage: string | null;
  openImage: (imgUrl: string) => void;
  closeImage: () => void;
}

export const useImageViewerStore = create<ImageViewerState>((set) => ({
  isOpen: false,
  activeImage: null,

  openImage: (imgUrl) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    set({ isOpen: true, activeImage: imgUrl });
  },
  closeImage: () => {
    set({ isOpen: false });

    if (closeTimeout) clearTimeout(closeTimeout);
    closeTimeout = setTimeout(() => {
      set((state) => (state.isOpen ? state : { ...state, activeImage: null }));
      closeTimeout = null;
    }, 300);
  },
}));
