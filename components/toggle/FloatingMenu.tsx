import { useGameStore } from "@/store/useGameStore";
import { SoundToggle } from "./SoundToggle";
import { ThemeToggle } from "./ThemeToggle";

export function FloatingMenu() {
  const isScreenZoomed = useGameStore((s) => s.isScreenZoomed);

  return (
    <div
      className={`fixed top-4 right-4 z-99 flex gap-4 transition-all duration-700 ease-in-out ${
        isScreenZoomed
          ? "opacity-0 pointer-events-none -translate-y-2.5"
          : "opacity-100 pointer-events-auto translate-y-0"
      }`}
    >
      <SoundToggle />
      <ThemeToggle />
    </div>
  );
}
