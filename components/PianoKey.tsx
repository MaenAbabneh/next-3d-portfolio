"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Howl } from "howler";
import { useFrame, useThree } from "@react-three/fiber";

const sound = new Howl({
  src: ["/textures/sound/piano-note-c2_1bpm_C.wav"],
  volume: 0.5,
});

gsap.registerPlugin(useGSAP);

export function PianoKey({ node, index }: { node: any; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const soundId = useRef<number | null>(null);

  const { contextSafe } = useGSAP({ scope: meshRef });
  const initialRotationX = useRef(node.rotation.x).current;

  useFrame(() => {
    if (
      meshRef.current &&
      soundId.current !== null &&
      sound.playing(soundId.current)
    ) {
      const distance = camera.position.distanceTo(meshRef.current.position);

      let vol = 1 - (distance - 2) / 15;
      vol = THREE.MathUtils.clamp(vol, 0, 1);

      sound.volume(vol, soundId.current);
    }
  });

  const handlePress = contextSafe((e: any) => {
    e.stopPropagation();

    const ROOT_INDEX = 12;
    const rate = Math.pow(2, (index - ROOT_INDEX) / 12);

    if (soundId.current) {
      sound.stop(soundId.current);
    }

    const id = sound.play();
    soundId.current = id;

    sound.rate(rate, id);

    sound.volume(0.8, id);

    if (meshRef.current) {
      gsap.killTweensOf(meshRef.current.rotation);
      meshRef.current.rotation.x = initialRotationX;
      gsap.to(meshRef.current.rotation, {
        x: initialRotationX + 0.1,
        duration: 0.15,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        overwrite: true,
      });
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={node.geometry}
      material={node.material}
      position={node.position}
      rotation={node.rotation}
      onClick={handlePress}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    />
  );
}
