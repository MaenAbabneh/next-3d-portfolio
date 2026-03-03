import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useRoomTextures } from "./useRoomTextures";
import { vertexShader, fragmentShader } from "../shaders/theme/shader";

export function useRoomMaterials() {
  const textures = useRoomTextures();

  const materialsRef = useRef<any>(null);

  useMemo(() => {
    if (materialsRef.current) return;

    if (!textures || Object.keys(textures).length === 0) return;

    const glass = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      transparent: true,
      opacity: 1,
      metalness: 0,
      roughness: 0,
      ior: 1.5,
      thickness: 0.01,
      specularIntensity: 1,
      envMapIntensity: 1,
      depthWrite: false,
    });

    const water = new THREE.MeshPhysicalMaterial({
      color: 0x558bc8,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    const createCinematicMaterial = (textureSet: number) => {
      let dayTex, nightTex;

      if (textureSet === 1) {
        dayTex = textures.roomTexture.First?.day;
        nightTex = textures.roomTexture.First?.night;
      } else if (textureSet === 2) {
        dayTex = textures.roomTexture.Second?.day;
        nightTex = textures.roomTexture.Second?.night;
      } else if (textureSet === 3) {
        dayTex = textures.roomTexture.Third?.day;
        nightTex = textures.roomTexture.Third?.night;
      } else {
        dayTex = textures.roomTexture.Fourth?.day;
        nightTex = textures.roomTexture.Fourth?.night;
      }

      return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uDayTexture: { value: dayTex },
          uNightTexture: { value: nightTex },
          uMixRatio: { value: 0.0 },
        },
        // transparent: true,
      });
    };

    const roomMaterials = {
      First: createCinematicMaterial(1),
      Second: createCinematicMaterial(2),
      Third: createCinematicMaterial(3),
      Fourth: createCinematicMaterial(4),
    };

    // حفظ المواد في الحارس

    materialsRef.current = { materials: roomMaterials, glass, water };
  }, [textures]);

  return materialsRef.current;
}
