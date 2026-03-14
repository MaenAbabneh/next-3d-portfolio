"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";
import type { GLTFResult } from "@/types/room.types";

interface RoomAccessoriesProps {
  nodes: GLTFResult["nodes"];
}

export function Clock({ nodes }: RoomAccessoriesProps) {
  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const updateClock = () => {
      const date = new Date();

      const hours = date.getHours() % 12;
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      const totalMinutes = minutes + seconds / 60;
      const minuteAngle = (-totalMinutes * (Math.PI * 2)) / 60;

      const totalHours = hours + minutes / 60;
      const hourAngle = (-totalHours * (Math.PI * 2)) / 12;

      if (minuteHandRef.current) {
        minuteHandRef.current.rotation.x = minuteAngle;
      }

      if (hourHandRef.current) {
        hourHandRef.current.rotation.x = hourAngle;
      }
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <group>
      <mesh
        name="Hour_Hand_First"
        geometry={nodes.Hour_Hand_First.geometry}
        material={nodes.Hour_Hand_First.material}
        ref={hourHandRef}
        position={[-1.093, 2.548, 0.209]}
      />
      <mesh
        name="Minute_Hand_First"
        geometry={nodes.Minute_Hand_First.geometry}
        material={nodes.Minute_Hand_First.material}
        ref={minuteHandRef}
        position={[-1.093, 2.548, 0.209]}
      />
    </group>
  );
}
