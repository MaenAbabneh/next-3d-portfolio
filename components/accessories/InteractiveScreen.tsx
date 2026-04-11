"use client";

import { useRef, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useGameStore } from "@/store/useGameStore";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { InteractiveMarker } from "../InteractiveMarker";
import { useIsMobile } from "@/hooks/useIsMobile";

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

  const started = useGameStore((s) => s.started);
  const isScreenZoomed = useGameStore((s) => s.isScreenZoomed);
  const setIsScreenZoomed = useGameStore((s) => s.setIsScreenZoomed);
  const setIsCameraUnlocked = useGameStore((s) => s.setIsCameraUnlocked);

  const camera = useThree((state) => state.camera);
  const controls = useThree(
    (state) => state.controls as OrbitControlsImpl | undefined,
  );

  const originalCameraPosRef = useRef<THREE.Vector3 | null>(null);
  const originalTargetRef = useRef<THREE.Vector3 | null>(null);

  const previousZoomState = useRef(false);

  const isMobile = useIsMobile();

  const screenX = -0.9;
  const screenY = 2.016;
  const screenZ = isMobile ? -0.2546 : -0.2546;
  const roomOffsetY = -1.5;

  const isMobileView = isMobile && isScreenZoomed;

  const iframeWidth = isMobileView ? 530 : 2340;
  const iframeHeight = isMobileView ? 800 : 1080;
  const defaultScale = 0.0108;

  useEffect(() => {
    if (previousZoomState.current && !isScreenZoomed) {
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
    }

    previousZoomState.current = isScreenZoomed;
  }, [isScreenZoomed, camera, controls, setIsCameraUnlocked]);

  const handleZoomIn = (e: ZoomClickEvent) => {
    e.stopPropagation();
    if (isScreenZoomed || !started) return;

    setIsScreenZoomed(true);
    setIsCameraUnlocked(true);

    if (!originalCameraPosRef.current) {
      originalCameraPosRef.current = camera.position.clone();
    }
    if (!originalTargetRef.current) {
      originalTargetRef.current =
        controls?.target?.clone() ?? new THREE.Vector3(0, 1, 0);
    }

    const aspect = window.innerWidth / window.innerHeight;

    let distanceX = 0.47;
    if (aspect < 0.6) {
      distanceX = 0.35;
    } else if (aspect < 1) {
      distanceX = 0.85;
    } else if (aspect < 1.4) {
      distanceX = 0.65;
    }

    gsap.to(camera.position, {
      x: screenX + distanceX,
      y: screenY - 0.36 + roomOffsetY,
      z: screenZ - (isMobile ? 0.036 : 0.033),
      duration: 1.5,
      ease: "power3.inOut",
    });

    if (controls) {
      gsap.to(controls.target, {
        x: screenX,
        y: screenY - 0.36 + roomOffsetY,
        z: screenZ - (isMobile ? 0.036 : 0.033),
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
      <InteractiveMarker
        title="DESKTOP"
        position={[-0.88, 2.02, -0.25]}
        rotation={[0, 1.57, 0]}
        visible={started && !isScreenZoomed}
        onClick={handleZoomIn}
      />

      {started && (
        <Html
          transform
          occlude={true}
          zIndexRange={[9, 0]}
          position={[screenX, screenY, screenZ]}
          rotation={[0, 1.57, 0]}
          scale={defaultScale}
          className="transition-opacity duration-1000"
          style={{ opacity: 1 }}
        >
          <div
            style={{
              width: iframeWidth,
              height: iframeHeight,
              background: "#000",
              position: "relative",
              borderRadius: "12px",
              overflow: "hidden",
              transform: isMobileView ? "scale(1.35)" : "scale(1)",
            }}
          >
            {isScreenZoomed && (
              <iframe
                src={url}
                title="Interactive Portfolio"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            )}

            {!isScreenZoomed && (
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
