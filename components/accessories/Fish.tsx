import { useUISound } from "@/hooks/audio/useUISound";
import { GLTFResult } from "@/types/room.types";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useCallback, useRef } from "react";
import * as THREE from "three";

interface FishProps {
  nodes: GLTFResult["nodes"];
}

export function Fish({ nodes }: FishProps) {
  const fishRef = useRef<THREE.Mesh>(null);
  const hoverTweenRef = useRef<gsap.core.Tween | null>(null);

  const { playHover } = useUISound();

  useGSAP(() => {
    if (!fishRef.current) return;

    gsap.to(fishRef.current.position, {
      y: "+=0.05",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  const handlePointerEnter = useCallback(() => {
    const mesh = fishRef.current;
    if (!mesh) return;

    hoverTweenRef.current?.kill();
    hoverTweenRef.current = gsap.to(mesh.scale, {
      x: 1.15,
      y: 1.15,
      z: 1.15,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    const mesh = fishRef.current;
    if (!mesh) return;

    hoverTweenRef.current?.kill();
    hoverTweenRef.current = gsap.to(mesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  return (
    <group name="Fish">
      <mesh
        ref={fishRef}
        name="Fish_Second_Hover_Raycaster"
        geometry={nodes.Fish_Second_Hover_Raycaster.geometry}
        material={nodes.Fish_Second_Hover_Raycaster.material}
        position={[0.248, 0.853, 1.039]}
        rotation={[-Math.PI, 0.019, -Math.PI]}
        onPointerEnter={() => {
          playHover();
          handlePointerEnter();
        }}
        onPointerLeave={handlePointerLeave}
      />
    </group>
  );
}
