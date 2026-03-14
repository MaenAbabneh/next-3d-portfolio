"use client";

import { PianoKey } from "../PianoKey";
import { KEYS, SUFFIX } from "@/constant/utils";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { GLTFResult } from "@/types/room.types";
import { useCallback, useEffect, useRef } from "react";
import { useGameStore } from "@/store/useGameStore";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { InteractiveMarker } from "@/components/InteractiveMarker";
import { Html } from "@react-three/drei";

const KEYBOARD_MAP: Record<string, number> = {
  // الأوكتاف الأول
  a: 0,
  w: 1,
  s: 2,
  e: 3,
  d: 4,
  f: 5,
  t: 6,
  g: 7,
  y: 8,
  h: 9,
  u: 10,
  j: 11,
  // الأوكتاف الثاني
  k: 12,
  o: 13,
  l: 14,
  p: 15,
  ";": 16,
  "'": 17,
  z: 18,
  x: 19,
  c: 20,
  v: 21,
  b: 22,
  n: 23,
};

interface PinoProps {
  nodes: GLTFResult["nodes"];
}

export function Pino({ nodes }: PinoProps) {
  const isPianoZoomed = useGameStore((s) => s.isPianoZoomed);
  const setIsPianoZoomed = useGameStore((s) => s.setIsPianoZoomed);
  const setIsCameraUnlocked = useGameStore((s) => s.setIsCameraUnlocked);
  const started = useGameStore((s) => s.started);

  type ControlsWithTarget = { target: THREE.Vector3; update?: () => void };
  const { camera } = useThree();
  const controls = useThree(
    (state) => (state as unknown as { controls?: ControlsWithTarget }).controls,
  );
  const pianoGroupRef = useRef<THREE.Group>(null);

  const originalCameraPosRef = useRef<THREE.Vector3 | null>(null);
  const originalTargetRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!isPianoZoomed) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const keyIndex = KEYBOARD_MAP[e.key.toLowerCase()];
      if (keyIndex !== undefined) {
        window.dispatchEvent(
          new CustomEvent("play-piano-key", { detail: { index: keyIndex } }),
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPianoZoomed]);

  const isMobile = useIsMobile();
  const pianoX = 0.95;
  const pianoY = isMobile ? 0.1 : -1.2;
  const pianoZ = -1.2;

  const handleZoomIn = () => {
    originalCameraPosRef.current = camera.position.clone();
    originalTargetRef.current =
      controls?.target?.clone() ?? new THREE.Vector3(0, 1, 0);

    setIsPianoZoomed(true);
    setIsCameraUnlocked(true);

    const aspect = window.innerWidth / window.innerHeight;

    let distanceY = 1;
    if (aspect < 0.6) {
      distanceY = 1.5; // موبايل بالطول: نرفع الكاميرا أكثر
    } else if (aspect < 1) {
      distanceY = 1; // تابلت بالطول
    } else if (aspect < 1.4) {
      distanceY = 0.8; // تابلت بالعرض
    }
    gsap.to(camera.position, {
      x: pianoX,
      y: distanceY,
      z: pianoZ + 0.5,
      duration: 1.5,
      ease: "power3.inOut",
    });

    if (controls) {
      gsap.to(controls.target, {
        x: pianoX,
        y: pianoY,
        z: pianoZ,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => {
          controls.update?.();
        },
      });
    }
  };

  const handleZoomOut = useCallback(() => {
    setIsPianoZoomed(false);

    if (originalCameraPosRef.current && controls && originalTargetRef.current) {
      gsap.to(camera.position, {
        x: originalCameraPosRef.current.x,
        y: originalCameraPosRef.current.y,
        z: originalCameraPosRef.current.z,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
          setIsCameraUnlocked(false);
          originalCameraPosRef.current = null;
          originalTargetRef.current = null;
        },
      });

      gsap.to(controls.target, {
        x: originalTargetRef.current.x,
        y: originalTargetRef.current.y,
        z: originalTargetRef.current.z,
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: () => {
          controls.update?.();
        },
      });
    }
  }, [camera, controls, setIsPianoZoomed, setIsCameraUnlocked]);

  useEffect(() => {
    if (!isPianoZoomed && originalCameraPosRef.current) {
      handleZoomOut();
    }
  }, [handleZoomOut, isPianoZoomed]);

  return (
    <group ref={pianoGroupRef}>
      <InteractiveMarker
        title="PLAY ME"
        position={[1, 1.3, -1]}
        visible={
          started && !isPianoZoomed && !useGameStore.getState().isScreenZoomed
        }
        onClick={handleZoomIn}
      />
      {isPianoZoomed && !isMobile && (
        <Html center position={[0.96, 1.6, -0.87]}>
          <div
            style={{
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "14px",
              textAlign: "center",
              whiteSpace: "nowrap",
              border: "1px solid white",
              pointerEvents: "none",
            }}
          >
            🎹 Use <span style={{ color: "#ffcc00" }}>A-L</span> &{" "}
            <span style={{ color: "#ffcc00" }}>Z-N</span> to play
          </div>
        </Html>
      )}

      {KEYS.map((keyName, index) => {
        const fullName = `${keyName}${SUFFIX}`;
        const node = nodes[fullName as keyof typeof nodes];
        if (!node || !(node instanceof THREE.Mesh)) return null;
        return (
          <PianoKey key={fullName} node={node} index={index} name={fullName} />
        );
      })}
    </group>
  );
}
