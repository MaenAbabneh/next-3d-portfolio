import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

interface ButtonProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
  position: [number, number, number];
  rotation: [number, number, number];
  url: string;
  name: string;
}

export const SocialItem = ({
  geometry,
  material,
  position,
  rotation,
  url,
  name,
}: ButtonProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation(); // منع النقر من اختراق المجسم والوصول للخلفية

    if (!meshRef.current) return;

    // تشغيل أنيميشن الضغط
    gsap.to(meshRef.current.scale, {
      x: 0.8, // تصغير الحجم
      y: 0.8,
      z: 0.8,
      duration: 0.1,
      yoyo: true, // العودة للحجم الأصلي
      repeat: 1,
      ease: "power1.inOut",
      onComplete: () => {
        // فتح الرابط بعد انتهاء الحركة
        window.open(url, "_blank");
      },
    });
  };

  return (
    <mesh
      ref={meshRef}
      name={name}
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      // تحسين بسيط: تكبير العنصر قليلاً عند الهوفر
      onPointerEnter={(e) => {
        e.stopPropagation();
        if (meshRef.current)
          gsap.to(meshRef.current.scale, {
            x: 1.1,
            y: 1.1,
            z: 1.1,
            duration: 0.2,
          });
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        if (meshRef.current)
          gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
      }}
    />
  );
};
