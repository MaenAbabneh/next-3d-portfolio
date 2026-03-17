"use client";

import { useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { GLTFResult } from "@/types/room.types";
import { useImageViewerStore } from "@/store/useImageViewerStore";
import { useUISound } from "@/hooks/audio/useUISound";

interface PictureFrameProps {
  nodes: GLTFResult["nodes"];
}

export function PictureFrame({ nodes }: PictureFrameProps) {
  const { openImage } = useImageViewerStore();
  const framOneRef = useRef<THREE.Group>(null);
  const framTwoRef = useRef<THREE.Group>(null);
  const framThreeRef = useRef<THREE.Group>(null);

  const frameImages = {
    Frame_1:
      "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1772375926/god-of-war_s5isza.webp",
    Frame_2:
      "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1772375926/god-of-war_s5isza.webp",
    Frame_3:
      "https://res.cloudinary.com/dsgajdqm0/image/upload/f_auto,q_auto/v1772375926/god-of-war_s5isza.webp",
  };

  const imageTexture = useTexture(frameImages);

  const allTextures = [...Object.values(imageTexture)];

  allTextures.forEach((texture) => {
    texture.flipY = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  });

  const animateFrameScale = (group: THREE.Group | null, isHovered: boolean) => {
    if (!group) return;

    gsap.to(group.scale, {
      x: isHovered ? 1.2 : 1,
      y: isHovered ? 1.2 : 1,
      z: isHovered ? 1.2 : 1,
      duration: 0.4,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });
  };

  const { playClick, playHover } = useUISound();

  return (
    <>
      <group
        ref={framOneRef}
        position={[-0.99, 2.417, 0.781]}
        onPointerOver={(e) => {
          e.stopPropagation();
          playHover();
          animateFrameScale(framOneRef.current, true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          animateFrameScale(framOneRef.current, false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          openImage(frameImages.Frame_1);
        }}
      >
        {/* Frame 1 */}
        <mesh
          name="Frame_1_Second_Raycaster_Hover"
          geometry={nodes.Frame_1_Second_Raycaster_Hover.geometry}
          material={nodes.Frame_1_Second_Raycaster_Hover.material}
          position={[0, 0, 0]}
          rotation={[-Math.PI, 0.661, -Math.PI]}
        />
        <mesh
          name="Frame_1"
          geometry={nodes.Frame_1.geometry}
          material={nodes.Frame_1.material}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial map={imageTexture.Frame_1} toneMapped={false} />
        </mesh>
      </group>

      <group
        ref={framTwoRef}
        position={[-0.993, 2.451, 1.251]}
        onPointerOver={(e) => {
          e.stopPropagation();
          playHover();
          animateFrameScale(framTwoRef.current, true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          animateFrameScale(framTwoRef.current, false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          openImage(frameImages.Frame_2);
        }}
      >
        {/* Frame 2 */}
        <mesh
          name="Frame_2_Second_Raycaster_Hover"
          geometry={nodes.Frame_2_Second_Raycaster_Hover.geometry}
          material={nodes.Frame_2_Second_Raycaster_Hover.material}
          position={[0, 0, 0]}
          rotation={[-Math.PI, 0.661, -Math.PI]}
        />
        <mesh
          name="Frame_2"
          geometry={nodes.Frame_2.geometry}
          material={nodes.Frame_2.material}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial map={imageTexture.Frame_2} toneMapped={false} />
        </mesh>
      </group>

      <group
        ref={framThreeRef}
        position={[-0.99, 2.032, 0.745]}
        onPointerOver={(e) => {
          e.stopPropagation();
          playHover();
          animateFrameScale(framThreeRef.current, true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          animateFrameScale(framThreeRef.current, false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          openImage(frameImages.Frame_3);
        }}
      >
        {/* Frame 3 */}
        <mesh
          name="Frame_3_Second_Raycaster_Hover"
          geometry={nodes.Frame_3_Second_Raycaster_Hover.geometry}
          material={nodes.Frame_3_Second_Raycaster_Hover.material}
          position={[0, 0, 0]}
          rotation={[-Math.PI, 0.661, -Math.PI]}
        />
        <mesh
          name="Frame_3"
          geometry={nodes.Frame_3.geometry}
          material={nodes.Frame_3.material}
          position={[0, 0, 0]}
        >
          <meshBasicMaterial map={imageTexture.Frame_3} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}
