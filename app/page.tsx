"use client";

import dynamic from "next/dynamic";

import ImageViewer from "@/components/overlay/ImageViewer";
import Overlay from "@/components/overlay/Overlay";
import { FloatingMenu } from "@/components/toggle/FloatingMenu";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useSoundStore } from "@/store/useSoundStore";
import { useGameStore } from "@/store/useGameStore";
import { useBackgroundMusic } from "@/hooks/audio/BackgroundMusic";

const Experience = dynamic(() => import("@/components/room/Experience"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-base-cream dark:bg-base-blue-light text-base-brwan flex items-center justify-center">
      Loading 3D...
    </div>
  ),
});

export default function Home() {
  const setStarted = useGameStore((s) => s.setStarted);
  const setBgmMuted = useSoundStore((s) => s.setBgmMuted);
  const setSfxMuted = useSoundStore((s) => s.setSfxMuted);

  useBackgroundMusic();

  const handleStarted = (withSound: boolean) => {
    setBgmMuted(!withSound);
    setSfxMuted(!withSound);
    setStarted(true);
  };

  return (
    <main>
      <LoadingScreen onStarted={handleStarted} />
      <Experience />
      <Overlay />
      <FloatingMenu />
      <ImageViewer />
    </main>
  );
}
