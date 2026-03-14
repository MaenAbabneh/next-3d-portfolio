"use client";

import { useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import type { GLTFResult } from "@/types/room.types";
import { useGameStore } from "@/store/useGameStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { InteractiveScreen } from "@/components/Accessories/InteractiveScreen";

interface RoomAccessoriesProps {
  nodes: GLTFResult["nodes"];
}

gsap.registerPlugin(useGSAP);

export function RoomAccessories({ nodes }: RoomAccessoriesProps) {
  const started = useGameStore((s) => s.started);

  const screen1Ref = useRef<THREE.MeshStandardMaterial>(null);
  const screen2Ref = useRef<THREE.MeshStandardMaterial>(null);
  const screen3Ref = useRef<THREE.MeshStandardMaterial>(null);

  const videoTexture = useVideoTexture(
    "https://res.cloudinary.com/dsgajdqm0/video/upload/v1772888225/screen-loop_w3slvn.mp4",
    {
      loop: true,
      muted: true,
      playsInline: true,
      crossOrigin: "anonymous",
      start: true,
    },
  );

  const { Poster: posterTexture } = useTexture({
    Poster:
      "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1772375926/god-of-war_s5isza.webp",
  });

  useEffect(() => {
    const textures: THREE.Texture[] = [posterTexture, videoTexture];

    textures.forEach((texture) => {
      texture.flipY = texture === videoTexture ? false : true;

      if (texture === posterTexture) {
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, -1);
        texture.offset.set(0, 1);
      }

      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
    });
  }, [posterTexture, videoTexture]);

  useGSAP(() => {
    const screens = [
      screen1Ref.current,
      screen2Ref.current,
      screen3Ref.current,
    ].filter(Boolean) as THREE.MeshStandardMaterial[];

    if (screens.length === 0) return;

    gsap.set(screens, {
      emissiveIntensity: 0,
    });
    gsap.set(
      screens.map((m) => m.color),
      { r: 0, g: 0, b: 0 },
    );

    if (!started) return;

    const tl = gsap.timeline();

    tl.to(screens, {
      delay: 0.5,
      duration: 0.2,
      emissiveIntensity: 4,
      ease: "power2.in",
    })
      .to(
        screens.map((m) => m.color),
        {
          duration: 0.2,
          r: 1,
          g: 1,
          b: 1,
          ease: "power2.in",
        },
        "<",
      )
      .to(screens, {
        duration: 0.4,
        emissiveIntensity: 1.2,
        ease: "bounce.out",
      });
  }, [started]);

  return (
    <group>
      {/* --- الشاشات (Screens) --- */}
      <InteractiveScreen
        geometry={nodes.Screen_1.geometry}
        position={[0.019, -0.367, -0.036]}
        url="https://www.danielprior.dk/"
      />

      <mesh
        name="Screen_2"
        geometry={nodes.Screen_2.geometry}
        position={[0.019, -0.367, -0.036]}
      >
        <meshStandardMaterial
          ref={screen2Ref}
          map={videoTexture}
          emissiveMap={videoTexture}
          emissive={new THREE.Color("white")}
          toneMapped={false}
        />
      </mesh>

      <mesh
        name="Screen_3"
        geometry={nodes.Screen_3.geometry}
        position={[0.019, -0.367, -0.036]}
      >
        <meshStandardMaterial
          ref={screen3Ref}
          map={videoTexture}
          emissiveMap={videoTexture}
          emissive={new THREE.Color("white")}
          toneMapped={false}
        />
      </mesh>

      {/* --- البوسترات (Posters) --- */}
      <mesh
        name="Poster-1"
        geometry={nodes["Poster-1"].geometry}
        material={nodes["Poster-1"].material}
        position={[-0.11, 1.746, -1.162]}
      >
        <meshBasicMaterial map={posterTexture} toneMapped={false} />
      </mesh>
    </group>
  );
}
