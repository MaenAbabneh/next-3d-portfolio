"use client";

import * as THREE from "three";
import { JSX, Suspense, useMemo, useRef } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { GLTFResult } from "@/types/room.types";
import { useTheme } from "next-themes";
import { useRoomMaterials } from "@/hooks/useRoomMaterials";
import { useCinematicTransition } from "@/hooks/animations/useCinematicTransition";
import { useIntroAnimation } from "@/hooks/animations/useIntroAnimation";
import { useHoverAnimation } from "@/hooks/animations/useHoverAnimation";
import { RoomAccessories } from "../accessories/RoomAccessories";
import { Clock } from "../accessories/Clock";
import { Pino } from "../accessories/Pino";
import { PictureFrame } from "../accessories/PictureFrame";
import { Menu } from "../accessories/Menu";
import { ComputerFan } from "../accessories/ComputerFan";
import { SocialButtons } from "../accessories/SocailButton.";
import { Chair } from "../accessories/Chair";
import { Fish } from "../accessories/Fish";
import { CoffeCup } from "../accessories/CoffeCup";

type ModelProps = JSX.IntrinsicElements["group"];

export function Model(props: ModelProps) {
  const { scene } = useGLTF(
    "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772701871/my-room-3d_ggiewf.glb"
  );
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone) as unknown as GLTFResult;

  const { resolvedTheme } = useTheme();

  const groupRef = useRef<THREE.Group>(null);

  const isNight = resolvedTheme === "dark";

  const roomTexture = useRoomMaterials();

  useCinematicTransition(roomTexture, isNight);

  useIntroAnimation(groupRef);
  useHoverAnimation(groupRef);

  useMemo(() => {
    if (!roomTexture) return;

    Object.entries(nodes).forEach(([name, node]) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        const lowerName = name.toLowerCase();

        switch (true) {
          case lowerName.includes("glass"):
            mesh.material = roomTexture.glass;
            break;
          case lowerName.includes("water"):
            mesh.material = roomTexture.water;
            break;
          case lowerName.includes("first"):
            mesh.material = roomTexture.materials.First;
            break;
          case lowerName.includes("second"):
            mesh.material = roomTexture.materials.Second;
            break;
          case lowerName.includes("third"):
            mesh.material = roomTexture.materials.Third;
            break;
          case lowerName.includes("fourth"):
            mesh.material = roomTexture.materials.Fourth;
            break;
          default:
            break;
        }
      }
    });
  }, [nodes, roomTexture]);

  return (
    <group ref={groupRef} position={[0, -1.5, 0]} {...props} dispose={null}>
      <group
        name="root"
        position={[1.152, 0.345, -0.148]}
        rotation={[0, -1.11, 0]}
      >
        <primitive object={nodes.root_1} />
        <primitive object={nodes.Bone001} />
        <primitive object={nodes.neck} />
        <primitive object={nodes.Bone009} />
        <primitive object={nodes.earR} />
        <primitive object={nodes.earR001} />
        <primitive object={nodes.earR002} />
        <primitive object={nodes.earL} />
        <primitive object={nodes.earL001} />
        <primitive object={nodes.earL002} />
        <primitive object={nodes.Bone002} />
        <primitive object={nodes.Bone003} />
        <primitive object={nodes.Bone004} />
        <primitive object={nodes.Bone008} />
        <primitive object={nodes.Bone005} />
        <primitive object={nodes.Bone010} />
        <primitive object={nodes.Bone006} />
        <primitive object={nodes.Bone011} />
        <primitive object={nodes.Bone007} />
        <primitive object={nodes.Bone012} />
      </group>
      <mesh
        name="Case_Glass"
        geometry={nodes.Case_Glass.geometry}
        material={nodes.Case_Glass.material}
        position={[0.076, -0.367, -0.036]}
      />
      <mesh
        name="Fish-Glass"
        geometry={nodes["Fish-Glass"].geometry}
        material={nodes["Fish-Glass"].material}
        position={[0.232, 0.913, 1.04]}
      />
      <mesh
        name="Fish-Water"
        geometry={nodes["Fish-Water"].geometry}
        material={nodes["Fish-Water"].material}
        position={[0.234, 0.878, 1.041]}
      />
      <mesh
        name="Water-Mug"
        geometry={nodes["Water-Mug"].geometry}
        material={nodes["Water-Mug"].material}
        position={[-0.741, 1.273, 0.19]}
      />
      <mesh
        name="Dot_1_Raycaster_Hover_Third"
        geometry={nodes.Dot_1_Raycaster_Hover_Third.geometry}
        material={nodes.Dot_1_Raycaster_Hover_Third.material}
        position={[1.109, 1.27, -1.146]}
      />
      <mesh
        name="Dot_2_Raycaster_Hover_Third"
        geometry={nodes.Dot_2_Raycaster_Hover_Third.geometry}
        material={nodes.Dot_2_Raycaster_Hover_Third.material}
        position={[1.142, 1.27, -1.148]}
      />
      <mesh
        name="Dot_3_Raycaster_Hover_Third"
        geometry={nodes.Dot_3_Raycaster_Hover_Third.geometry}
        material={nodes.Dot_3_Raycaster_Hover_Third.material}
        position={[1.176, 1.271, -1.15]}
      />
      <mesh
        name="Name_Letter_1_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_1_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_1_Third_Raycaster_Hover.material}
        position={[0.53, 1.264, -1.11]}
      />
      <mesh
        name="Name_Letter_2_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_2_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_2_Third_Raycaster_Hover.material}
        position={[0.567, 1.269, -1.112]}
      />
      <mesh
        name="Name_Letter_3_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_3_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_3_Third_Raycaster_Hover.material}
        position={[0.62, 1.27, -1.115]}
      />
      <mesh
        name="Name_Letter_4_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_4_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_4_Third_Raycaster_Hover.material}
        position={[0.686, 1.271, -1.119]}
      />
      <mesh
        name="Name_Letter_5_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_5_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_5_Third_Raycaster_Hover.material}
        position={[0.741, 1.271, -1.123]}
      />
      <mesh
        name="Name_Letter_6_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_6_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_6_Third_Raycaster_Hover.material}
        position={[0.792, 1.269, -1.126]}
      />
      <mesh
        name="Name_Letter_7_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_7_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_7_Third_Raycaster_Hover.material}
        position={[0.855, 1.271, -1.13]}
      />
      <mesh
        name="Name_Letter_8_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_8_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_8_Third_Raycaster_Hover.material}
        position={[0.879, 1.269, -1.132]}
      />
      <mesh
        name="Name_Letter_9_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_9_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_9_Third_Raycaster_Hover.material}
        position={[0.914, 1.272, -1.133]}
      />
      <mesh
        name="Name_Letter_10_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_10_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_10_Third_Raycaster_Hover.material}
        position={[0.966, 1.271, -1.137]}
      />
      <mesh
        name="Name_Letter_11_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_11_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_11_Third_Raycaster_Hover.material}
        position={[1.019, 1.268, -1.14]}
      />
      <mesh
        name="Name_Letter_12_Third_Raycaster_Hover"
        geometry={nodes.Name_Letter_12_Third_Raycaster_Hover.geometry}
        material={nodes.Name_Letter_12_Third_Raycaster_Hover.material}
        position={[1.053, 1.27, -1.142]}
      />
      <mesh
        name="Rock_1_Third_Raycaster_Hover"
        geometry={nodes.Rock_1_Third_Raycaster_Hover.geometry}
        material={nodes.Rock_1_Third_Raycaster_Hover.material}
        position={[-1.912, -0.355, 1.433]}
        rotation={[-2.877, -0.18, -1.499]}
      />
      <mesh
        name="Rock_2_Third_Raycaster_Hover"
        geometry={nodes.Rock_2_Third_Raycaster_Hover.geometry}
        material={nodes.Rock_2_Third_Raycaster_Hover.material}
        position={[-0.468, -0.22, 1.966]}
        rotation={[-0.259, -0.438, 1.499]}
      />
      <mesh
        name="Rock_3_Third_Raycaster_Hover"
        geometry={nodes.Rock_3_Third_Raycaster_Hover.geometry}
        material={nodes.Rock_3_Third_Raycaster_Hover.material}
        position={[0.425, -0.106, 1.771]}
        rotation={[2.743, 1.201, -0.981]}
      />
      <mesh
        name="Rock_4_Third_Raycaster_Hover"
        geometry={nodes.Rock_4_Third_Raycaster_Hover.geometry}
        material={nodes.Rock_4_Third_Raycaster_Hover.material}
        position={[1.891, -0.147, 0.864]}
        rotation={[-3.124, 0.02, 0.094]}
      />
      <mesh
        name="Rock_5_Third_Raycaster_Hover"
        geometry={nodes.Rock_5_Third_Raycaster_Hover.geometry}
        material={nodes.Rock_5_Third_Raycaster_Hover.material}
        position={[2.286, -0.244, 0.859]}
        rotation={[3.132, 0.136, 3.123]}
      />
      <mesh
        name="Rock_6_Third_Raycaster_Hover"
        geometry={nodes.Rock_6_Third_Raycaster_Hover.geometry}
        material={nodes.Rock_6_Third_Raycaster_Hover.material}
        position={[1.973, -0.133, -0.38]}
        rotation={[-0.138, 0.453, 2.967]}
      />
      <mesh
        name="Rock_7_Third_Raycaster_Hover"
        geometry={nodes.Rock_7_Third_Raycaster_Hover.geometry}
        material={nodes.Rock_7_Third_Raycaster_Hover.material}
        position={[1.385, -0.421, -2.151]}
        rotation={[-0.591, 1.141, 2.158]}
      />
      <mesh
        name="Seaweed_1_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_1_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_1_Hover_Third_Raycaster.material}
        position={[-1.087, -0.014, 1.955]}
        rotation={[0.352, -0.845, -1.123]}
      />
      <mesh
        name="Seaweed_2_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_2_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_2_Hover_Third_Raycaster.material}
        position={[-1.002, 0.246, 1.789]}
        rotation={[0, -0.784, -Math.PI / 2]}
      />
      <mesh
        name="Seaweed_3_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_3_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_3_Hover_Third_Raycaster.material}
        position={[-0.746, 0.082, 1.771]}
        rotation={[-0.31, -1.054, -1.778]}
      />
      <mesh
        name="Seaweed_4_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_4_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_4_Hover_Third_Raycaster.material}
        position={[-0.183, 0.144, 1.704]}
        rotation={[0, -1.385, -Math.PI / 2]}
      />
      <mesh
        name="Seaweed_5_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_5_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_5_Hover_Third_Raycaster.material}
        position={[-0.015, 0.016, 1.881]}
        rotation={[-1.007, -1.372, -2.529]}
      />
      <mesh
        name="Seaweed_6_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_6_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_6_Hover_Third_Raycaster.material}
        position={[1.22, -0.035, 1.761]}
        rotation={[-0.262, -0.948, -1.72]}
      />
      <mesh
        name="Seaweed_7_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_7_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_7_Hover_Third_Raycaster.material}
        position={[1.46, 0.044, 1.699]}
        rotation={[0, -0.866, -Math.PI / 2]}
      />
      <mesh
        name="Seaweed_8_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_8_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_8_Hover_Third_Raycaster.material}
        position={[1.651, -0.095, 1.572]}
        rotation={[-0.677, -1.301, -2.19]}
      />
      <mesh
        name="Seaweed_9_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_9_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_9_Hover_Third_Raycaster.material}
        position={[1.919, -0.005, 0.146]}
        rotation={[0.145, -0.024, -1.61]}
      />
      <mesh
        name="Seaweed_10_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_10_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_10_Hover_Third_Raycaster.material}
        position={[1.744, -0.053, -0.659]}
        rotation={[0.279, -0.293, -1.369]}
      />
      <mesh
        name="Seaweed_11_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_11_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_11_Hover_Third_Raycaster.material}
        position={[1.78, 0.039, -0.893]}
        rotation={[-0.004, -0.535, -1.493]}
      />
      <mesh
        name="Seaweed_12_Hover_Third_Raycaster"
        geometry={nodes.Seaweed_12_Hover_Third_Raycaster.geometry}
        material={nodes.Seaweed_12_Hover_Third_Raycaster.material}
        position={[1.792, -0.023, -1.181]}
        rotation={[0.299, -0.821, -1.285]}
      />
      <mesh
        name="Hanging_Plank_1_Third"
        geometry={nodes.Hanging_Plank_1_Third.geometry}
        material={nodes.Hanging_Plank_1_Third.material}
        position={[-1.256, 2.574, 1.488]}
        rotation={[-1.571, -1.557, -Math.PI]}
      />
      <mesh
        name="Bird_Father_Fourth_Raycaster_Hover"
        geometry={nodes.Bird_Father_Fourth_Raycaster_Hover.geometry}
        material={nodes.Bird_Father_Fourth_Raycaster_Hover.material}
        position={[-0.873, 1.344, -0.493]}
        rotation={[Math.PI / 2, 0, -1.671]}
      />
      <mesh
        name="Bird_Son_Fourth_Raycaster_Hover"
        geometry={nodes.Bird_Son_Fourth_Raycaster_Hover.geometry}
        material={nodes.Bird_Son_Fourth_Raycaster_Hover.material}
        position={[-0.885, 1.342, -0.565]}
        rotation={[Math.PI / 2, 0, -1.671]}
      />
      <mesh
        name="Box_1_Hover_Fourth_Raycaster"
        geometry={nodes.Box_1_Hover_Fourth_Raycaster.geometry}
        material={nodes.Box_1_Hover_Fourth_Raycaster.material}
        position={[-0.099, 0.345, -0.878]}
        rotation={[0, -0.247, 0]}
      />
      <mesh
        name="Box_2_Hover_Fourth_Raycaster"
        geometry={nodes.Box_2_Hover_Fourth_Raycaster.geometry}
        material={nodes.Box_2_Hover_Fourth_Raycaster.material}
        position={[-0.049, 0.568, -0.873]}
        rotation={[0, -0.445, 0]}
      />
      <mesh
        name="Box_3_Hover_Fourth_Raycaster"
        geometry={nodes.Box_3_Hover_Fourth_Raycaster.geometry}
        material={nodes.Box_3_Hover_Fourth_Raycaster.material}
        position={[-0.022, 0.749, -0.86]}
        rotation={[0, -0.067, 0]}
      />
      <mesh
        name="Cam_Fourth_Raycaster_Hover"
        geometry={nodes.Cam_Fourth_Raycaster_Hover.geometry}
        material={nodes.Cam_Fourth_Raycaster_Hover.material}
        position={[-1.005, 1.342, -0.492]}
        rotation={[0, 1.185, 0]}
      />
      <mesh
        name="Duck_Father_Fourth_Hover_Raycaster"
        geometry={nodes.Duck_Father_Fourth_Hover_Raycaster.geometry}
        material={nodes.Duck_Father_Fourth_Hover_Raycaster.material}
        position={[-0.904, 1.341, -0.023]}
        rotation={[-Math.PI, 1.321, -Math.PI]}
      />
      <mesh
        name="Duck_Son_Fourth_Hover_Raycaster"
        geometry={nodes.Duck_Son_Fourth_Hover_Raycaster.geometry}
        material={nodes.Duck_Son_Fourth_Hover_Raycaster.material}
        position={[-0.903, 1.345, -0.1]}
        rotation={[-Math.PI, 1.321, -Math.PI]}
      />
      <mesh
        name="Keyboard_Raycaster_Hover_Fourth"
        geometry={nodes.Keyboard_Raycaster_Hover_Fourth.geometry}
        material={nodes.Keyboard_Raycaster_Hover_Fourth.material}
        position={[-0.625, 1.184, -0.164]}
        rotation={[0, 0.168, 0]}
      />
      <mesh
        name="Kitten_Raycaster_Hover_Fourth"
        geometry={nodes.Kitten_Raycaster_Hover_Fourth.geometry}
        material={nodes.Kitten_Raycaster_Hover_Fourth.material}
        position={[-0.998, 2.036, 1.059]}
        rotation={[Math.PI / 2, 0, -0.296]}
      />
      <mesh
        name="Puppy_Raycaster_Hover_Fourth"
        geometry={nodes.Puppy_Raycaster_Hover_Fourth.geometry}
        material={nodes.Puppy_Raycaster_Hover_Fourth.material}
        position={[-1.015, 2.038, 0.942]}
        rotation={[Math.PI / 2, 0, 0.092]}
      />
      <mesh
        name="Slipper_1_Fourth_Hover_Raycaster"
        geometry={nodes.Slipper_1_Fourth_Hover_Raycaster.geometry}
        material={nodes.Slipper_1_Fourth_Hover_Raycaster.material}
        position={[-0.761, 0.389, -0.576]}
      />
      <mesh
        name="Slipper_2_Fourth_Hover_Raycaster"
        geometry={nodes.Slipper_2_Fourth_Hover_Raycaster.geometry}
        material={nodes.Slipper_2_Fourth_Hover_Raycaster.material}
        position={[-0.81, 0.387, -0.265]}
      />
      <mesh
        name="Bulb_1_Fourth_Raycaster_Hover_2"
        geometry={nodes.Bulb_1_Fourth_Raycaster_Hover_2.geometry}
        material={nodes.Bulb_1_Fourth_Raycaster_Hover_2.material}
        position={[-1.009, 2.354, 0.557]}
        rotation={[-1.71, 0.045, -1.302]}
      />
      <mesh
        name="Bulb_2_Fourth_Raycaster_Hover_2"
        geometry={nodes.Bulb_2_Fourth_Raycaster_Hover_2.geometry}
        material={nodes.Bulb_2_Fourth_Raycaster_Hover_2.material}
        position={[-1.014, 2.334, 0.359]}
        rotation={[-1.71, 0.045, -1.302]}
      />
      <mesh
        name="Bulb_3_Fourth_Raycaster_Hover_2"
        geometry={nodes.Bulb_3_Fourth_Raycaster_Hover_2.geometry}
        material={nodes.Bulb_3_Fourth_Raycaster_Hover_2.material}
        position={[-1.037, 2.369, 0.166]}
        rotation={[-1.71, 0.045, -1.302]}
      />
      <mesh
        name="Bulb_4_Fourth_Raycaster_Hover_2"
        geometry={nodes.Bulb_4_Fourth_Raycaster_Hover_2.geometry}
        material={nodes.Bulb_4_Fourth_Raycaster_Hover_2.material}
        position={[-1.075, 2.44, -0.015]}
        rotation={[-1.71, 0.045, -1.302]}
      />
      <mesh
        name="Bulb_5_Fourth_Raycaster_Hover_2"
        geometry={nodes.Bulb_5_Fourth_Raycaster_Hover_2.geometry}
        material={nodes.Bulb_5_Fourth_Raycaster_Hover_2.material}
        position={[-1.099, 2.502, -0.202]}
        rotation={[-1.71, 0.045, -1.302]}
      />
      <mesh
        name="Bulb_6_Fourth_Raycaster_Hover_2"
        geometry={nodes.Bulb_6_Fourth_Raycaster_Hover_2.geometry}
        material={nodes.Bulb_6_Fourth_Raycaster_Hover_2.material}
        position={[-1.058, 2.469, -0.458]}
        rotation={[-1.71, 0.045, -1.302]}
      />
      <mesh
        name="Bulb_7_Fourth_Raycaster_Hover_2"
        geometry={nodes.Bulb_7_Fourth_Raycaster_Hover_2.geometry}
        material={nodes.Bulb_7_Fourth_Raycaster_Hover_2.material}
        position={[-0.949, 2.381, -0.669]}
        rotation={[-1.71, 0.045, -1.302]}
      />
      <mesh
        name="Bulb_8_Fourth_Raycaster_Hover_2"
        geometry={nodes.Bulb_8_Fourth_Raycaster_Hover_2.geometry}
        material={nodes.Bulb_8_Fourth_Raycaster_Hover_2.material}
        position={[-0.825, 2.343, -0.859]}
        rotation={[-1.71, 0.045, -1.302]}
      />
      <mesh
        name="Bulb_9_Fourth_Raycaster_Hover_2"
        geometry={nodes.Bulb_9_Fourth_Raycaster_Hover_2.geometry}
        material={nodes.Bulb_9_Fourth_Raycaster_Hover_2.material}
        position={[-0.684, 2.354, -1.037]}
        rotation={[-1.71, 0.045, -1.302]}
      />
      <mesh
        name="Bear_Father_Fourth_Hover_Raycaster"
        geometry={nodes.Bear_Father_Fourth_Hover_Raycaster.geometry}
        material={nodes.Bear_Father_Fourth_Hover_Raycaster.material}
        position={[-0.996, 2.41, 1.064]}
        rotation={[0, 0.201, 0]}
      />
      <mesh
        name="Bear_Son_Fourth_Hover_Raycaster"
        geometry={nodes.Bear_Son_Fourth_Hover_Raycaster.geometry}
        material={nodes.Bear_Son_Fourth_Hover_Raycaster.material}
        position={[-0.926, 2.41, 0.981]}
        rotation={[0, 0.201, 0]}
      />
      <mesh
        name="Boba_Plushie_Fourth_Raycaster_Hover"
        geometry={nodes.Boba_Plushie_Fourth_Raycaster_Hover.geometry}
        material={nodes.Boba_Plushie_Fourth_Raycaster_Hover.material}
        position={[-0.642, 2.44, -1.065]}
        rotation={[-0.114, 0.586, 0.473]}
      />
      <mesh
        name="Egg_1_Fourth_Hover_Raycaster"
        geometry={nodes.Egg_1_Fourth_Hover_Raycaster.geometry}
        material={nodes.Egg_1_Fourth_Hover_Raycaster.material}
        position={[-1.075, 2.631, -0.368]}
        rotation={[-2.261, 0.66, 2.914]}
      />
      <mesh
        name="Egg_2_Fourth_Hover_Raycaster"
        geometry={nodes.Egg_2_Fourth_Hover_Raycaster.geometry}
        material={nodes.Egg_2_Fourth_Hover_Raycaster.material}
        position={[-1.029, 2.631, -0.368]}
        rotation={[-2.485, -0.06, -2.684]}
      />
      <mesh
        name="Egg_3_Fourth_Hover_Raycaster"
        geometry={nodes.Egg_3_Fourth_Hover_Raycaster.geometry}
        material={nodes.Egg_3_Fourth_Hover_Raycaster.material}
        position={[-1.052, 2.631, -0.327]}
        rotation={[-2.445, -0.319, -2.474]}
      />
      <mesh
        name="Evee_Fourth_Raycaster_Hover"
        geometry={nodes.Evee_Fourth_Raycaster_Hover.geometry}
        material={nodes.Evee_Fourth_Raycaster_Hover.material}
        position={[-0.897, 1.039, 0.882]}
        rotation={[Math.PI / 2, 0, 1.487]}
      />
      <mesh
        name="Flower_Basket_Raycaster_Hover_Fourth"
        geometry={nodes.Flower_Basket_Raycaster_Hover_Fourth.geometry}
        material={nodes.Flower_Basket_Raycaster_Hover_Fourth.material}
        position={[-0.619, 1.029, 0.855]}
        rotation={[0, 0.341, 0]}
      />
      <mesh
        name="Lamp_Fourth_Hover_Raycaster"
        geometry={nodes.Lamp_Fourth_Hover_Raycaster.geometry}
        material={nodes.Lamp_Fourth_Hover_Raycaster.material}
        position={[0.449, 0.341, -0.849]}
        rotation={[0, -0.235, 0]}
      />
      <mesh
        name="Mouth_Raycaster_Hover_Fourth"
        geometry={nodes.Mouth_Raycaster_Hover_Fourth.geometry}
        material={nodes.Mouth_Raycaster_Hover_Fourth.material}
        position={[-0.572, 1.21, -0.634]}
        rotation={[0, 0.383, 0]}
      />
      <mesh
        name="Mug_Fourth_Raycaster_Hover"
        geometry={nodes.Mug_Fourth_Raycaster_Hover.geometry}
        material={nodes.Mug_Fourth_Raycaster_Hover.material}
        position={[-0.74, 1.201, 0.191]}
      />
      <mesh
        name="Cactus_Raycaster_Fourth_Hover"
        geometry={nodes.Cactus_Raycaster_Fourth_Hover.geometry}
        material={nodes.Cactus_Raycaster_Fourth_Hover.material}
        position={[-1.062, 2.568, -0.522]}
      />
      <mesh
        name="Calender"
        geometry={nodes.Calender.geometry}
        material={nodes.Calender.material}
        position={[-0.768, 1.242, 0.364]}
        rotation={[Math.PI / 2, 0, -0.236]}
      />
      <mesh
        name="Flower_4_Fourth_Hover_Raycaster"
        geometry={nodes.Flower_4_Fourth_Hover_Raycaster.geometry}
        material={nodes.Flower_4_Fourth_Hover_Raycaster.material}
        position={[-0.956, 1.719, 1.3]}
        rotation={[0, -0.572, 0]}
      />
      <mesh
        name="Flower_5_Fourth_Hover_Raycaster"
        geometry={nodes.Flower_5_Fourth_Hover_Raycaster.geometry}
        material={nodes.Flower_5_Fourth_Hover_Raycaster.material}
        position={[-0.94, 1.737, 1.24]}
        rotation={[0, 0.151, 0]}
      />
      <mesh
        name="Microphone_Hover_Fourth_Raycaster"
        geometry={nodes.Microphone_Hover_Fourth_Raycaster.geometry}
        material={nodes.Microphone_Hover_Fourth_Raycaster.material}
        position={[1.455, 1.197, -0.97]}
        rotation={[0, -0.579, 0]}
      />
      <mesh
        name="Flower_1_Fourth_Hover_Raycaster"
        geometry={nodes.Flower_1_Fourth_Hover_Raycaster.geometry}
        material={nodes.Flower_1_Fourth_Hover_Raycaster.material}
        position={[-0.917, 1.23, 0.57]}
        rotation={[-0.097, -0.139, -0.054]}
      />
      <mesh
        name="Flower_2_Fourth_Hover_Raycaster"
        geometry={nodes.Flower_2_Fourth_Hover_Raycaster.geometry}
        material={nodes.Flower_2_Fourth_Hover_Raycaster.material}
        position={[-0.979, 1.254, 0.579]}
        rotation={[0.276, -1.257, 0]}
      />
      <mesh
        name="Flower_3_Fourth_Hover_Raycaster"
        geometry={nodes.Flower_3_Fourth_Hover_Raycaster.geometry}
        material={nodes.Flower_3_Fourth_Hover_Raycaster.material}
        position={[-0.99, 1.21, 0.567]}
        rotation={[-Math.PI, 0.479, -Math.PI]}
      />
      <mesh
        name="Pencil_1_Fourth_Hover_Raycaster"
        geometry={nodes.Pencil_1_Fourth_Hover_Raycaster.geometry}
        material={nodes.Pencil_1_Fourth_Hover_Raycaster.material}
        position={[-0.768, 1.249, 1.225]}
      />
      <mesh
        name="Pencil_2_Fourth_Hover_Raycaster"
        geometry={nodes.Pencil_2_Fourth_Hover_Raycaster.geometry}
        material={nodes.Pencil_2_Fourth_Hover_Raycaster.material}
        position={[-0.819, 1.249, 1.225]}
      />
      <mesh
        name="Pencil_3_Fourth_Hover_Raycaster"
        geometry={nodes.Pencil_3_Fourth_Hover_Raycaster.geometry}
        material={nodes.Pencil_3_Fourth_Hover_Raycaster.material}
        position={[-0.766, 1.252, 1.161]}
      />
      <mesh
        name="Pencil_4_Fourth_Hover_Raycaster"
        geometry={nodes.Pencil_4_Fourth_Hover_Raycaster.geometry}
        material={nodes.Pencil_4_Fourth_Hover_Raycaster.material}
        position={[-0.83, 1.244, 1.166]}
      />
      <mesh
        name="Pencil_5_Fourth_Hover_Raycaster"
        geometry={nodes.Pencil_5_Fourth_Hover_Raycaster.geometry}
        material={nodes.Pencil_5_Fourth_Hover_Raycaster.material}
        position={[-0.787, 1.248, 1.154]}
      />
      <mesh
        name="Hanging_Plank_2_Third"
        geometry={nodes.Hanging_Plank_2_Third.geometry}
        material={nodes.Hanging_Plank_2_Third.material}
        position={[-1.272, 2.548, 2.021]}
        rotation={[0, 1.526, 0]}
      />
      <mesh
        name="First"
        geometry={nodes.First.geometry}
        material={nodes.First.material}
        position={[-1.168, 2.131, 1.266]}
      />
      <mesh
        name="Second"
        geometry={nodes.Second.geometry}
        material={nodes.Second.material}
        position={[0.032, 0.665, -0.05]}
        rotation={[-Math.PI, 0.661, -Math.PI]}
      />
      <mesh
        name="Third"
        geometry={nodes.Third.geometry}
        material={nodes.Third.material}
        position={[-0.779, 0.665, 1.003]}
      />
      <mesh
        name="Fourth"
        geometry={nodes.Fourth.geometry}
        material={nodes.Fourth.material}
        position={[-0.852, 1.163, 1.226]}
      />
      <mesh
        name="PS5_Digital_stand"
        geometry={nodes.PS5_Digital_stand.geometry}
        material={nodes.PS5_Digital_stand.material}
        position={[-0.735, 1.184, -0.899]}
        rotation={[Math.PI / 2, 0, -1.588]}
      />

      <Pino nodes={nodes} />

      <Clock nodes={nodes} />

      <Suspense fallback={null}>
        <RoomAccessories nodes={nodes} />
      </Suspense>

      <Suspense fallback={null}>
        <PictureFrame nodes={nodes} />
      </Suspense>

      <Menu nodes={nodes} />

      <ComputerFan nodes={nodes} />

      <SocialButtons nodes={nodes} />

      <Chair nodes={nodes} />

      <Fish nodes={nodes} />

      <CoffeCup nodes={nodes} />

      <skinnedMesh
        name="Cat_Second"
        geometry={nodes.Cat_Second.geometry}
        material={nodes.Cat_Second.material}
        skeleton={nodes.Cat_Second.skeleton}
        morphTargetDictionary={nodes.Cat_Second.morphTargetDictionary}
        morphTargetInfluences={nodes.Cat_Second.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload(
  "https://res.cloudinary.com/dsgajdqm0/image/upload/v1772701871/my-room-3d_ggiewf.glb"
);
