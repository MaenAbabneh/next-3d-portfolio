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

import { useGameStore } from "@/store/useGameStore";
import { useSettingsStore } from "@/store/useSettingsStore";

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ResponsiveInitialCamera } from "../ResponsiveInitialCamera";

export default function Experience() {
  const isCameraUnlocked = useGameStore((s) => s.isCameraUnlocked);
  const isMobile = useIsMobile();

  const quality = useSettingsStore((s) => s.quality);
  const isHighQuality = quality === "high";

  const [autoDpr, setAutoDpr] = useState(1.5);

  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  }, []);

  const currentDpr = isHighQuality ? autoDpr : 0.8;

  return (
    <div className="w-full h-screen bg-[#111111]">
      <Canvas
        flat
        camera={{
          position: isMobile ? [9, 6, 9] : [6, 4, 6],
        }}
        dpr={currentDpr}
        gl={{
          powerPreference: "high-performance",
          antialias: isHighQuality,
          stencil: false,
          depth: true,
          alpha: false,
        }}
      >
        <ResponsiveInitialCamera />

        {isHighQuality && (
          <PerformanceMonitor
            onDecline={() => setAutoDpr(0.8)}
            onIncline={() => setAutoDpr(1)}
          />
        )}

        <Environment
          preset="city"
          resolution={isHighQuality ? 256 : 64}
          frames={1}
        />

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
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
