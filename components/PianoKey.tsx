"use client";

import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Howl, Howler } from "howler";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useSoundStore } from "@/store/useSoundStore";

let pianoSound: Howl | null = null;

function getPianoSound() {
  if (pianoSound) return pianoSound;
  pianoSound = new Howl({
    src: [
      "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3/v1772802641/piano-note-c2_zbmvwc.mp3",
    ],
    preload: true,
    volume: 0.3,
  });
  return pianoSound;
}

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

  const pianoMuted = useSoundStore((s) => s.pianoMuted);
  const pianoVolume = useSoundStore((s) => s.pianoVolume);

  useFrame(() => {
    const sound = pianoSound;
    if (
      meshRef.current &&
      soundId.current !== null &&
      sound &&
      sound.playing(soundId.current)
    ) {
      const distance = camera.position.distanceTo(meshRef.current.position);
      let vol = 1 - (distance - 2) / 15;
      vol = THREE.MathUtils.clamp(vol, 0, 1);

      if (pianoMuted) {
        vol = 0;
      } else {
        vol = vol * pianoVolume;
      }

      sound.volume(vol, soundId.current);
    }
  });

  const playNote = useCallback(() => {
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

    if (pianoMuted) return;

    try {
      void Howler.ctx?.resume();
    } catch {}

    const sound = getPianoSound();
    const ROOT_INDEX = 12;
    const rate = Math.pow(2, (index - ROOT_INDEX) / 12);

    if (soundId.current) {
      sound.stop(soundId.current);
    }

    const id = sound.play();
    soundId.current = id;
    sound.rate(rate, id);
    sound.volume(pianoVolume, id);
  }, [index, pianoMuted, pianoVolume]);

  const handlePress = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    playNote();
  };

  useEffect(() => {
    type PlayPianoKeyDetail = { index: number };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<PlayPianoKeyDetail>;
      if (customEvent.detail?.index === index) {
        playNote();
      }
    };
    window.addEventListener("play-piano-key", handleCustomEvent);
    return () =>
      window.removeEventListener("play-piano-key", handleCustomEvent);
  }, [index, playNote]);

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
