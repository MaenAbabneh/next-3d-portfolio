import { useTexture, shaderMaterial } from "@react-three/drei";
import { useFrame, extend, type ThreeElement } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { steamVertexShader, steamFragmentShader } from "@/shaders/steam/shader";

// 1. تعريف الماتيريال مرة واحدة خارج المكون
const SteamMaterial = shaderMaterial(
  {
    uTime: 0,
    uPerlinTexture: null,
    uColor: new THREE.Color(1, 1, 1), // أضفنا لون للتحكم
  },
  steamVertexShader,
  steamFragmentShader,
);

extend({ SteamMaterial });

// تعريف Types
declare module "@react-three/fiber" {
  interface ThreeElements {
    steamMaterial: Omit<
      ThreeElement<typeof SteamMaterial>,
      "uTime" | "uPerlinTexture" | "uColor"
    > & {
      uTime?: number;
      uPerlinTexture?: THREE.Texture;
      transparent?: boolean;
      depthWrite?: boolean;
      side?: THREE.Side;
      uColor?: THREE.Color;
    };
  }
}

interface SteamProps {
  name?: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  opacity?: number;
  hoverGroup?: string;
}

export function Steam({
  name = "Coffee_Steam",
  position = [0, 0, 0],
  scale = [1, 1, 1],
  color = "#ffffff",
  hoverGroup,
}: SteamProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const perlinTexture = useTexture("/textures/perlin.png", (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  useFrame((_, delta) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value += delta;
  });

  return (
    <mesh
      name={name}
      scale={scale}
      position={position}
      userData={hoverGroup ? { hoverGroup } : undefined}
    >
      <planeGeometry args={[1, 1, 16, 64]} />
      <steamMaterial
        ref={materialRef}
        uPerlinTexture={perlinTexture}
        uColor={new THREE.Color(color)}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
