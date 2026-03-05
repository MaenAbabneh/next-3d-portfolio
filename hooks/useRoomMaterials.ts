import * as THREE from "three";
import { useMemo } from "react";
import { useRoomTextures } from "./useRoomTextures";
import { vertexShader, fragmentShader } from "../shaders/theme/shader";

export type RoomMaterialBundle = {
  materials: {
    First: THREE.ShaderMaterial;
    Second: THREE.ShaderMaterial;
    Third: THREE.ShaderMaterial;
    Fourth: THREE.ShaderMaterial;
  };
  glass: THREE.MeshPhysicalMaterial;
  water: THREE.MeshPhysicalMaterial;
};

export function useRoomMaterials(): RoomMaterialBundle | null {
  const textures = useRoomTextures();

  return useMemo(() => {
    if (!textures || Object.keys(textures).length === 0) return null;

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

    const createCinematicMaterial = (
      textureSet: number,
    ): THREE.ShaderMaterial => {
      let dayTex: THREE.Texture | undefined;
      let nightTex: THREE.Texture | undefined;

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

    return { materials: roomMaterials, glass, water };
  }, [textures]);
}
