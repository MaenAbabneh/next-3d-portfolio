"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  quality: "high" | "low";
  language: "en" | "ar";
  toggleQuality: () => void;
  toggleLanguage: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      quality: "high",
      language: "en",

      toggleQuality: () =>
        set({ quality: get().quality === "high" ? "low" : "high" }),
      toggleLanguage: () =>
        set({ language: get().language === "en" ? "ar" : "en" }),
    }),
    {
      name: "portfolio:settings",
    },
  ),
);
