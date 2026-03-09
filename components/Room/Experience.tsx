"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Model } from "./Room";

import { LoadingScreen } from "../LoadingScreen";
import { ThemeToggle } from "@/components/Toggle/ThemeToggle";
import { useSoundStore } from "@/store/useSoundStore";
import { SoundToggle } from "../Toggle/SoundToggle";

export default function Experience() {
  const [startExperience, setStartExperience] = useState(false);
  const setMuted = useSoundStore((s) => s.setMuted);

  const handleStarted = (withSound: boolean) => {
    setMuted(!withSound);
    setStartExperience(true);
  };
  return (
    <div className="w-full h-screen bg-[#111111]">
      <LoadingScreen onStarted={handleStarted} />

      <div className="absolute top-10 right-14 z-10 flex gap-4">
        <SoundToggle />
        <ThemeToggle />
      </div>

      <Canvas camera={{ position: [5, 4, 5], fov: 45 }}>
        <Environment preset="city" />
        <OrbitControls
          makeDefault
          enableDamping={true}
          minDistance={4}
          maxDistance={13}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minAzimuthAngle={-Math.PI / 38}
          maxAzimuthAngle={Math.PI / 2}
          enablePan={false}
          target={[0, 1, 0]}
        />
        <Suspense fallback={null}>
          <Model started={startExperience} />
        </Suspense>
      </Canvas>
    </div>
  );
}
