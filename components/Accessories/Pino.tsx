"use client";

import { PianoKey } from "../PianoKey";
import { KEYS, SUFFIX } from "@/constant/utils";

export function Pino({ nodes }: { nodes: any }) {
  return (
    <group>
      {KEYS.map((keyName, index) => {
        const fullName = `${keyName}${SUFFIX}`;
        const node = nodes[fullName];

        if (!node) return null;

        return (
          <PianoKey key={fullName} node={node} index={index} name={fullName} />
        );
      })}
    </group>
  );
}
