"use client";

import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Howl, Howler } from "howler";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";

let pianoSound: Howl | null = null;

function getPianoSound() {
  if (pianoSound) return pianoSound;
  pianoSound = new Howl({
    src: [
      "https://res.cloudinary.com/dsgajdqm0/video/upload/f_mp3/v1772802641/piano-note-c2_zbmvwc.mp3",
    ],
    preload: true,
    volume: 0.5,
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
      sound.volume(vol, soundId.current);
    }
  });

  // 🌟 1. فصلنا منطق العزف في دالة مستقلة لتعمل مع الماوس والكيبورد
  const playNote = useCallback(() => {
    try {
      void Howler.ctx?.resume(); // لضمان عمل الصوت في المتصفحات
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
  }, [index]);

  const handlePress = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    playNote(); // تشغيل عبر الماوس
  };

  // 🌟 2. السحر هنا: الاستماع لأوامر الكيبورد التي ستأتي من الملف الرئيسي
  useEffect(() => {
    type PlayPianoKeyDetail = { index: number };

    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<PlayPianoKeyDetail>;
      // إذا كان الرقم المرسل يطابق رقم هذا الزر، اعزف!
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
