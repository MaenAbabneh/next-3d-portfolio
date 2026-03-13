"use client";

import { Canvas } from "@react-three/fiber";
import {
  Bvh,
  Environment,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Model } from "./Room";
import { useIsMobile } from "@/hooks/useIsMobile";

import { LoadingScreen } from "../LoadingScreen";
import { ThemeToggle } from "@/components/Toggle/ThemeToggle";
import { useGameStore } from "@/store/useGameStore";
import { useSoundStore } from "@/store/useSoundStore";
import { SoundToggle } from "../Toggle/SoundToggle";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export default function Experience() {
  const setStarted = useGameStore((s) => s.setStarted);
  const setMuted = useSoundStore((s) => s.setMuted);
  const isScreenZoomed = useGameStore((s) => s.isScreenZoomed);
  const isCameraUnlocked = useGameStore((s) => s.isCameraUnlocked);
  const [dpr, setDpr] = useState(1.5);

  const isMobile = useIsMobile();

  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleStarted = (withSound: boolean) => {
    setMuted(!withSound);
    setStarted(true);
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  }, []);

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

      <Canvas
        camera={{
          position: isMobile ? [9, 6, 9] : [6, 4, 6],
          fov: isMobile ? 55 : 45,
        }}
        dpr={dpr}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDpr(1)}
          onIncline={() => setDpr(1.5)}
        />

        <Environment preset="city" resolution={256} frames={1} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableDamping={true}
          minDistance={isCameraUnlocked ? 0.3 : 3}
          maxDistance={isMobile ? 15 : 13}
          minPolarAngle={isCameraUnlocked ? 0 : 0}
          maxPolarAngle={isCameraUnlocked ? Math.PI : Math.PI / 2 - 0.1}
          minAzimuthAngle={isCameraUnlocked ? -Infinity : -Math.PI / 38}
          maxAzimuthAngle={isCameraUnlocked ? Infinity : Math.PI / 2}
          enableRotate={!isCameraUnlocked}
          enableZoom={!isCameraUnlocked}
        />
        <Bvh firstHitOnly>
          <Suspense fallback={null}>
            <Model />
          </Suspense>
        </Bvh>
      </Canvas>
    </div>
  );
}
