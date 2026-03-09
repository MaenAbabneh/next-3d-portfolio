import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { GLTFResult } from "@/types/room.types";

interface ComputerFanProps {
  nodes: GLTFResult["nodes"];
}

export function ComputerFan({ nodes }: ComputerFanProps) {
  const fan1Ref = useRef<THREE.Mesh>(null);
  const fan2Ref = useRef<THREE.Mesh>(null);
  const fan3Ref = useRef<THREE.Mesh>(null);
  const fan4Ref = useRef<THREE.Mesh>(null);
  const fan5Ref = useRef<THREE.Mesh>(null);
  useGSAP(() => {
    const fansGroup1 = [fan1Ref.current, fan2Ref.current, fan3Ref.current];
    const fansGroup2 = [fan4Ref.current, fan5Ref.current];

    fansGroup1.forEach((fan) => {
      if (!fan) return;

      gsap.to(fan.rotation, {
        y: `+=${Math.PI * 2}`,
        duration: 2,
        repeat: -1,
        ease: "linear",
      });
    });
    fansGroup2.forEach((fan) => {
      if (!fan) return;

      gsap.to(fan.rotation, {
        x: `+=${Math.PI * 2}`,
        duration: 2,
        repeat: -1,
        ease: "linear",
      });
    });
  }, [nodes]);

  return (
    <group name="ComputerFan">
      <mesh
        ref={fan1Ref}
        name="Computer_Fan_1_Fourth_Raycaster"
        geometry={nodes.Computer_Fan_1_Fourth_Raycaster.geometry}
        material={nodes.Computer_Fan_1_Fourth_Raycaster.material}
        position={[-0.621, 0.511, 0.296]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={fan2Ref}
        name="Computer_Fan_2_Fourth_Raycaster"
        geometry={nodes.Computer_Fan_2_Fourth_Raycaster.geometry}
        material={nodes.Computer_Fan_2_Fourth_Raycaster.material}
        position={[-0.717, 0.511, 0.296]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={fan3Ref}
        name="Computer_Fan_3_Fourth_Raycaster"
        geometry={nodes.Computer_Fan_3_Fourth_Raycaster.geometry}
        material={nodes.Computer_Fan_3_Fourth_Raycaster.material}
        position={[-0.815, 0.511, 0.296]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={fan4Ref}
        name="Computer_Fan_4_Fourth_Raycaster"
        geometry={nodes.Computer_Fan_4_Fourth_Raycaster.geometry}
        material={nodes.Computer_Fan_4_Fourth_Raycaster.material}
        position={[-0.987, 0.539, 0.205]}
        rotation={[0, 0, -Math.PI / 2]}
      />
      <mesh
        ref={fan5Ref}
        name="Computer_Fan_5_Fourth_Raycaster"
        geometry={nodes.Computer_Fan_5_Fourth_Raycaster.geometry}
        material={nodes.Computer_Fan_5_Fourth_Raycaster.material}
        position={[-0.987, 0.635, 0.204]}
        rotation={[0, 0, -Math.PI / 2]}
      />
    </group>
  );
}
