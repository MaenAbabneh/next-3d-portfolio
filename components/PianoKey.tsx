"use client";

import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Howl } from "howler";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";

const sound = new Howl({
  src: ["/textures/sound/piano-note-c2_1bpm_C.wav"],
  preload: true,
  volume: 0.5,
});

export function PianoKey({
  node,
  index,
  name,
}: {
  node: THREE.Mesh;
  index: number;
  name?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const soundId = useRef<number | null>(null);
  const initialRotationX = useRef<number>(node.rotation.x);

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

  const handlePress = (e: ThreeEvent<MouseEvent>) => {
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
      meshRef.current.rotation.x = initialRotationX.current;
      gsap.to(meshRef.current.rotation, {
        x: initialRotationX.current + 0.1,
        duration: 0.2,
        ease: "back.out(1.8)",
        yoyo: true,
        repeat: 1,
        overwrite: true,
      });
    }
  };

  return (
    <mesh
      name={name ?? node?.name}
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
