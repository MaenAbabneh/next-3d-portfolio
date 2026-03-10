"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Model } from "./Room";

import { LoadingScreen } from "../LoadingScreen";
import { ThemeToggle } from "@/components/Toggle/ThemeToggle";
import { useGameStore } from "@/store/useGameStore";
import { useSoundStore } from "@/store/useSoundStore";
import { SoundToggle } from "../Toggle/SoundToggle";

export default function Experience() {
  const setStarted = useGameStore((s) => s.setStarted);
  const setMuted = useSoundStore((s) => s.setMuted);
  const isScreenZoomed = useGameStore((s) => s.isScreenZoomed);
  const isCameraUnlocked = useGameStore((s) => s.isCameraUnlocked);

  const handleStarted = (withSound: boolean) => {
    setMuted(!withSound);
    setStarted(true);
  };
  return (
    <div className="w-full h-screen bg-[#111111]">
      <LoadingScreen onStarted={handleStarted} />

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

      <Canvas camera={{ position: [5, 4, 5], fov: 45 }}>
        <Environment preset="city" />
        <OrbitControls
          makeDefault
          enableDamping={true}
          minDistance={isCameraUnlocked ? 0.3 : 3}
          maxDistance={13}
          minPolarAngle={isCameraUnlocked ? 0 : 0}
          maxPolarAngle={isCameraUnlocked ? Math.PI : Math.PI / 2 - 0.1}
          minAzimuthAngle={isCameraUnlocked ? -Infinity : -Math.PI / 38}
          maxAzimuthAngle={isCameraUnlocked ? Infinity : Math.PI / 2}
          enableRotate={!isCameraUnlocked}
          enableZoom={!isCameraUnlocked}
          target={[0, 1, 0]}
        />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
    </div>
  );
}
