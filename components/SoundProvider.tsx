"use client";

import { Howler } from "howler";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SoundContextValue = {
  muted: boolean;
  setMuted: (value: boolean) => void;
  toggleMuted: () => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

const STORAGE_KEY = "portfolio:muted";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const initialMuted = saved === "1" || saved === "true";
      setMutedState(initialMuted);
      Howler.mute(initialMuted);
    } catch {
      Howler.mute(false);
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;

    Howler.mute(muted);
    try {
      localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch {
      // ignore (storage may be blocked)
    }
  }, [muted]);

  const setMuted = useCallback((value: boolean) => {
    setMutedState(value);
  }, []);

  const toggleMuted = useCallback(() => {
    setMutedState((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ muted, setMuted, toggleMuted }),
    [muted, setMuted, toggleMuted],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return ctx;
}
