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

import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export default function Experience() {
  const isCameraUnlocked = useGameStore((s) => s.isCameraUnlocked);
  const [dpr, setDpr] = useState(1.5);

  const isMobile = useIsMobile();

  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <div className="w-full h-screen bg-[#111111]">
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
