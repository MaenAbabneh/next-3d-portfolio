"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const LANGUAGE_COOKIE_NAME = "portfolio:settings-language";

function readStoredLanguage() {
  if (typeof document === "undefined") return "en" as const;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LANGUAGE_COOKIE_NAME}=([^;]*)`),
  );

  return match?.[1] === "ar" ? "ar" : "en";
}

function writeLanguageCookie(language: "en" | "ar") {
  if (typeof document === "undefined") return;

  document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=31536000; samesite=lax`;
}

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
      language: readStoredLanguage(),

      toggleQuality: () =>
        set({ quality: get().quality === "high" ? "low" : "high" }),
      toggleLanguage: () => {
        const nextLanguage = get().language === "en" ? "ar" : "en";
        writeLanguageCookie(nextLanguage);
        set({ language: nextLanguage });
      },
    }),
    {
      name: "portfolio:settings",
    },
  ),
);
