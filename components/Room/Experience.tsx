"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { Model } from "./Room"; // تأكد من المسار

import { Loader } from "../LoadingScreen";

export default function Experience() {
  const [start, setStart] = useState(false);

  return (
    <div className="w-full h-screen bg-[#111111]">
      <Loader started={start} onStarted={() => setStart(true)} />

      <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
        <Environment preset="city" />
        <OrbitControls makeDefault />
        <Suspense fallback={null}>
          <Model started={start} />
        </Suspense>
      </Canvas>
    </div>
  );
}
