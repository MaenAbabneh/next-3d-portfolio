"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { Model } from "./Room"; 

export default function Home() {
  return (
    // نجعل الشاشة سوداء وتأخذ كامل حجم المتصفح
    <main className="w-full h-screen bg-[#111111]">
      <Canvas camera={{ position: [5, 3, 5], fov: 45 }}>
        
        {/* 1. إضاءة محيطية خفيفة جداً لكي لا تكون الغرفة مظلمة تماماً */}
        <ambientLight intensity={0.5} />
        
        {/* 2. إضاءة بيئة واقعية (تعطي انعكاسات جميلة على الشاشات) */}
        <Environment preset="city" />
        
        {/* 3. أداة سحرية تسمح لك بالدوران حول الغرفة بالماوس */}
        <OrbitControls makeDefault />

        {/* 4. تحميل الغرفة (Suspense تمنع الموقع من التعليق أثناء تحميل الـ 1 ميجا) */}
        <Suspense fallback={null}>
          <Model />
        </Suspense>

      </Canvas>
    </main>
  );
}