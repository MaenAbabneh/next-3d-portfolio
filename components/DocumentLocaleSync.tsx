"use client";

import { useEffect } from "react";

import { useSettingsStore } from "@/store/useSettingsStore";

export default function DocumentLocaleSync() {
  const language = useSettingsStore((state) => state.language);

  useEffect(() => {
    const root = document.documentElement;
    const dir = language === "ar" ? "rtl" : "ltr";

    root.lang = language;
    root.dir = dir;
    root.dataset.locale = language;
  }, [language]);

  return null;
}
