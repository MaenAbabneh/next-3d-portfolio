"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Model } from "./Room"; // تأكد من المسار

import { LoadingScreen } from "../LoadingScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSound } from "@/components/SoundProvider";
import { SoundToggle } from "../SoundToggle";

export default function Experience() {
  const [startExperience, setStartExperience] = useState(false);
  const { setMuted } = useSound();

  const handleStarted = (withSound: boolean) => {
    setMuted(!withSound);

    // ملاحظة: لا نخفي المكون فوراً لأن الأنيميشن يحتاج وقتاً
    // لكن GSAP في المكون يتعامل مع إخراج العنصر من الشاشة (y: 200vh)
    // يمكننا هنا فقط تغيير الحالة للسماح للتجربة بالعمل
    setStartExperience(true);
  };
  return (
    <div className="w-full h-screen bg-[#111111]">
      <LoadingScreen onStarted={handleStarted} />

      <div className="absolute top-10 right-14 z-10 flex gap-4">
        <SoundToggle />
        <ThemeToggle />
      </div>

      <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
        <Environment preset="city" />
        <OrbitControls makeDefault />
        <Suspense fallback={null}>
          <Model started={startExperience} />
        </Suspense>
      </Canvas>
    </div>
  );
}
