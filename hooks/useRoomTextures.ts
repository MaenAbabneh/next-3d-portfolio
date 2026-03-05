import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useLayoutEffect } from "react";

export const useRoomTextures = () => {
  const rawTextures = useTexture({
    "day-1":
      "https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1772696782/texture-day-1_tprp4k.png",
    "day-2":
      "https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1772696783/texture-day-2_ruyhf1.png",
    "day-3":
      "https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1772700563/texture-day-3_m01m7o.png",
    "day-4":
      "https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1772696786/texture-day-4_dlthhg.png",
    "night-1":
      "https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1772696783/texture-night-1_azij12.png",
    "night-2":
      "https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1772696784/texture-night-2_ohwyie.png",
    "night-3":
      "https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1772700561/texture-night-3_hknleh.png",
    "night-4":
      "https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1772696787/texture-night-4_qnfcru.png",
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

  return { roomTexture: structuredTextures };
};
