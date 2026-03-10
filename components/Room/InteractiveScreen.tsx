"use client";

import { Html } from "@react-three/drei";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

type ZoomClickEvent = ThreeEvent<MouseEvent> | React.MouseEvent<HTMLElement>;

interface InteractiveScreenProps {
  geometry: THREE.BufferGeometry;
  position: [number, number, number];
  url: string;
}

export function InteractiveScreen({
  geometry,
  position,
  url,
}: InteractiveScreenProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const started = useGameStore((s) => s.started);
  const setIsScreenZoomed = useGameStore((s) => s.setIsScreenZoomed);
  const setIsCameraUnlocked = useGameStore((s) => s.setIsCameraUnlocked);

  const camera = useThree((state) => state.camera);
  const controls = useThree(
    (state) => state.controls as OrbitControlsImpl | undefined,
  );

  const originalCameraPosRef = useRef<THREE.Vector3 | null>(null);
  const originalTargetRef = useRef<THREE.Vector3 | null>(null);

  // إحداثيات الشاشة (كما ضبطتها أنت)
  const screenX = -0.9;
  const screenY = 2.016;
  const screenZ = -0.2546;

  const handleZoomIn = (e: ZoomClickEvent) => {
    e.stopPropagation();
    if (isZoomed || !started) return;

    setIsZoomed(true);
    setIsScreenZoomed(true);
    setIsCameraUnlocked(true);

    if (!originalCameraPosRef.current) {
      originalCameraPosRef.current = camera.position.clone();
    }
    if (!originalTargetRef.current) {
      originalTargetRef.current =
        controls?.target?.clone() ?? new THREE.Vector3(0, 1, 0);
    }

    gsap.to(camera.position, {
      x: screenX + 0.42,
      y: screenY - 0.36,
      z: screenZ - 0.033,
      duration: 1.5,
      ease: "power3.inOut",
    });

    if (controls) {
      gsap.to(controls.target, {
        x: screenX,
        y: screenY - 0.36,
        z: screenZ - 0.033,
        duration: 1.5,
        ease: "power3.inOut",
      });
    }
  };

  const handleZoomOut = () => {
    setIsZoomed(false);
    setIsScreenZoomed(false);
    const originalCameraPos =
      originalCameraPosRef.current ?? new THREE.Vector3(5, 3, 5);
    const originalTarget =
      originalTargetRef.current ?? new THREE.Vector3(0, 1, 0);

    gsap.to(camera.position, {
      x: originalCameraPos.x,
      y: originalCameraPos.y,
      z: originalCameraPos.z,
      duration: 1.5,
      ease: "power3.inOut",
      onComplete: () => {
        setIsCameraUnlocked(false);
      },
    });

    if (controls) {
      gsap.to(controls.target, {
        x: originalTarget.x,
        y: originalTarget.y,
        z: originalTarget.z,
        duration: 1.5,
        ease: "power3.inOut",
      });
    }
  };

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      onClick={handleZoomIn}
    >
      <meshStandardMaterial
        emissive={new THREE.Color("white")}
        toneMapped={false}
      />

      {started && (
        <Html
          transform
          occlude="blending"
          zIndexRange={[9, 0]}
          position={[screenX, screenY, screenZ]}
          rotation={[0, 1.57, 0]}
          scale={0.0108}
          className="transition-opacity duration-1000"
          style={{ opacity: 1 }}
        >
          <div
            style={{
              width: "2340px",
              height: "1080px",
              background: "#000",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <iframe
              src={url}
              title="Interactive Portfolio"
              style={{ width: "100%", height: "100%", border: "none" }}
            />

            {isZoomed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "20px",
                  padding: "15px 30px",
                  fontSize: "24px",
                  backgroundColor: "rgba(255,50,50,0.9)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
              >
                Exit Screen
              </button>
            )}

            {!isZoomed && (
              <button
                type="button"
                aria-label="Zoom into screen"
                onClick={handleZoomIn}
                onPointerEnter={() => (document.body.style.cursor = "pointer")}
                onPointerLeave={() => (document.body.style.cursor = "auto")}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              />
            )}
          </div>
        </Html>
      )}
    </mesh>
  );
}
