"use client";

import { PianoKey } from "../PianoKey";
import { KEYS, SUFFIX } from "@/constant/utils";
import * as THREE from "three";
import type { GLTFResult } from "@/types/room.types";

interface PinoProps {
  nodes: GLTFResult["nodes"];
}
export function Pino({ nodes }: PinoProps) {
  return (
    <group>
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
