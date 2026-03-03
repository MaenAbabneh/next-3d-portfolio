import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useLayoutEffect } from "react";

export const useRoomTextures = () => {
  const rawTextures = useTexture({
    "day-1": "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772539220/texture-day-1_fxxwpr.webp",
    "day-2": "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772375896/texture-day-2_zoo49s.webp",
    "day-3": "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772375896/texture-day-3_yurejc.webp",
    "day-4": "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772375897/texture-day-4_rz9urx.webp",
    "night-1": "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772539220/texture-night-1_czwvr6.webp",
    "night-2": "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772375906/texture-night-2_ostzfa.webp",
    "night-3": "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772375906/texture-night-3_z3pb5l.webp",
    "night-4": "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772375907/texture-night-4_xcwsq3.webp",
  });


  useLayoutEffect(() => {
    Object.values(rawTextures).forEach((texture) => {
      texture.colorSpace = THREE.NoColorSpace;
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

  return { roomTexture:structuredTextures };
};
