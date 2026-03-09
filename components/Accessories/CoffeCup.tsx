import { GLTFResult } from "@/types/room.types";
import { useRef } from "react";
import * as THREE from "three";
import { Steam } from "@/Effects/Steam";

interface CoffeCupProps {
  nodes: GLTFResult["nodes"];
}

export function CoffeCup({ nodes }: CoffeCupProps) {
  const groupRef = useRef<THREE.Group>(null);

  const mugPosition = [-0.521, 1.201, 0.295] as const;

  return (
    <group ref={groupRef} name="CoffeCup" position={mugPosition}>
      <mesh
        name="Coffee_Mug_Fourth_Raycaster_Hover"
        geometry={nodes.Coffee_Mug_Fourth_Raycaster_Hover.geometry}
        material={nodes.Coffee_Mug_Fourth_Raycaster_Hover.material}
        userData={{ hoverGroup: "CoffeeCup" }}
      />
      <Steam
        position={[0, 0.33, -0.01]}
        scale={[0.2, 0.6, 0.1]}
        hoverGroup="CoffeeCup"
      />
    </group>
  );
}
