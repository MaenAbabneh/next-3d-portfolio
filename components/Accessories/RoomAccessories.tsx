"use client";

import { useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

interface RoomAccessoriesProps {
  nodes: any; // يمكنك تحسين هذا النوع حسب هيكل البيانات الفعلي
}

export function RoomAccessories({ nodes }: RoomAccessoriesProps) {
  const videoTexture = useVideoTexture("/textures/video/screen-loop.mp4");

  // 2. تحميل صور البوسترات
  const imageTexture = useTexture({
    Poster:
      "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1772375926/god-of-war_s5isza.webp",
    // Frame_1:
    //   "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1772375926/frame-1_ou5l8c.webp",
    // Frame_2:
    //   "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1772375926/frame-2_ou5l8c.webp",
    // Frame_3:
    //   "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1772375926/frame-3_ou5l8c.webp",
  });

  // 3. إعدادات الخامات
  useMemo(() => {
    const allTextures = [...Object.values(imageTexture), videoTexture];

    allTextures.forEach((texture) => {
      texture.flipY = false; // منع انعكاس الصورة رأسياً
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    });
  }, [videoTexture, imageTexture]);

  return (
    <group>
      {/* --- الشاشات (Screens) --- */}
      <mesh
        name="Screen_2"
        geometry={nodes.Screen_2.geometry}
        position={[0.019, -0.367, -0.036]}
      >
        <meshBasicMaterial map={videoTexture} toneMapped={false} />
      </mesh>
      <mesh
        name="Screen_3"
        geometry={nodes.Screen_3.geometry}
        position={[0.019, -0.367, -0.036]}
      >
        <meshBasicMaterial map={videoTexture} toneMapped={false} />
      </mesh>
      <mesh
        name="Screen_1"
        geometry={nodes.Screen_1.geometry}
        position={[0.019, -0.367, -0.036]}
      >
        <meshBasicMaterial map={videoTexture} toneMapped={false} />
      </mesh>
      {/* --- البوسترات (Posters) --- */}
      <mesh
        name="Poster-1"
        geometry={nodes["Poster-1"].geometry}
        material={nodes["Poster-1"].material}
        position={[-0.11, 1.746, -1.162]}
      >
        <meshBasicMaterial map={imageTexture.Poster} toneMapped={false} />
      </mesh>
      <mesh
        name="Frame_1"
        geometry={nodes.Frame_1.geometry}
        material={nodes.Frame_1.material}
        position={[-0.99, 2.417, 0.781]}
      />
      <mesh
        name="Frame_2"
        geometry={nodes.Frame_2.geometry}
        material={nodes.Frame_2.material}
        position={[-0.993, 2.451, 1.251]}
      />
      <mesh
        name="Frame_3"
        geometry={nodes.Frame_3.geometry}
        material={nodes.Frame_3.material}
        position={[-0.99, 2.032, 0.745]}
      />
    </group>
  );
}
