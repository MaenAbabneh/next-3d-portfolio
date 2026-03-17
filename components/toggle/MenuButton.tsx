"use client";

import { useEffect, useRef, useState } from "react";
import { useCursor } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useOverlayStore } from "@/store/useOverlayStore";
import { MenuButtonProps } from "@/types/globle.types";
import { useUISound } from "@/hooks/audio/useUISound";

const SCALE_KEY = "__menuButtonOriginalScale";
const ROT_KEY = "__menuButtonOriginalRotation";

export default function MenuButton({
  name,
  geometry,
  material,
  position,
  rotation,
  type,
}: MenuButtonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { openOverlay } = useOverlayStore();
  const [isHovered, setIsHovered] = useState(false);

  useCursor(isHovered, "pointer", "auto");

  const { playHover, playClick } = useUISound();

  useEffect(() => {
    const mesh = meshRef.current;
    return () => {
      if (!mesh) return;
      gsap.killTweensOf(mesh.scale);
      gsap.killTweensOf(mesh.rotation);
      gsap.killTweensOf(mesh.position);
    };
  }, []);

  const handleHover = (isHovering: boolean) => {
    if (!meshRef.current) return;
    playHover();

    if (!meshRef.current.userData[SCALE_KEY]) {
      meshRef.current.userData[SCALE_KEY] = meshRef.current.scale.clone();
    }
    if (!meshRef.current.userData[ROT_KEY]) {
      meshRef.current.userData[ROT_KEY] = meshRef.current.rotation.clone();
    }

    const initScale = meshRef.current.userData[SCALE_KEY] as THREE.Vector3;
    const initRot = meshRef.current.userData[ROT_KEY] as THREE.Euler;

    const direction = type === "about" ? -1 : 1;

    const hoverScale = 1.2;
    const rotateX = Math.PI / 10;
    const duration = 0.5;
    const easeType = "back.out(2)";

    gsap.killTweensOf(meshRef.current.scale);
    gsap.killTweensOf(meshRef.current.rotation);

    // حركة تكبير مرنة
    gsap.to(meshRef.current.scale, {
      x: isHovering ? initScale.x * hoverScale : initScale.x,
      y: isHovering ? initScale.y * hoverScale : initScale.y,
      z: isHovering ? initScale.z * hoverScale : initScale.z,
      duration: isHovering ? duration : 0.5,
      ease: easeType,
      overwrite: "auto",
    });

    gsap.to(meshRef.current.rotation, {
      x: isHovering ? initRot.x + rotateX * direction : initRot.x,
      y: initRot.y,
      z: initRot.z,
      duration: isHovering ? duration : 0.5,
      ease: easeType,
      overwrite: "auto",
    });
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    playClick();

    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 0.9,
        y: 0.9,
        z: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => openOverlay(type),
      });
    } else {
      openOverlay(type);
    }
  };

  return (
    <mesh
      ref={meshRef}
      name={name}
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        handleHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
        handleHover(false);
      }}
    />
  );
}
