import { useTexture } from "@react-three/drei";
import { useLayoutEffect } from "react";
import * as THREE from "three";

export const useRoomTextures = () => {
  const rawTextures = useTexture({
    "day-1": "/textures/day-1.webp",
    "day-2": "/textures/day-2.webp",
    "day-3": "/textures/day-3.webp",
    "day-4": "/textures/day-4.webp",
    "night-1": "/textures/night-1.webp",
    "night-2": "/textures/night-2.webp",
    "night-3": "/textures/night-3.webp",
    "night-4": "/textures/night-4.webp",
  });

  useLayoutEffect(() => {
    Object.values(rawTextures).forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
      texture.minFilter = THREE.LinearFilter;
    });
  }, [rawTextures]);

  const structuredTextures = {
    First: {
      day: rawTextures["day-1"],
      night: rawTextures["night-1"],
    },
    Second: {
      day: rawTextures["day-2"],
      night: rawTextures["night-2"],
    },
    Third: {
      day: rawTextures["day-3"],
      night: rawTextures["night-3"],
    },
    Fourth: {
      day: rawTextures["day-4"],
      night: rawTextures["night-4"],
    },
  };

  return structuredTextures;
};
