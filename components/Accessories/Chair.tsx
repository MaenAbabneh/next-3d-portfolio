import { GLTFResult } from "@/types/room.types";
import { useGameStore } from "@/store/useGameStore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import * as THREE from "three";

interface ChairProps {
  nodes: GLTFResult["nodes"];
}

export function Chair({ nodes }: ChairProps) {
  const groupRef = useRef<THREE.Group>(null);

  const started = useGameStore((s) => s.started);

  useGSAP(() => {
    if (!started || !groupRef.current) return;

    const initialRotationY = groupRef.current.rotation.y;

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 10,
      defaults: { ease: "power1.inOut", duration: 4 },
    });

    tl.to(groupRef.current.rotation, {
      y: initialRotationY + Math.PI / 3,
    }).to(groupRef.current.rotation, {
      y: initialRotationY,
    });
  }, [started]);

  return (
    <group ref={groupRef} name="Chair">
      <mesh
        name="Chair_Second_Raycaster_Hover"
        geometry={nodes.Chair_Second_Raycaster_Hover.geometry}
        material={nodes.Chair_Second_Raycaster_Hover.material}
        position={[0.032, 0.809, -0.05]}
        rotation={[0, 0.397, 0]}
      />
    </group>
  );
}
