"use client";

import { GLTFResult } from "@/types/room.types";
import MenuButton from "../MenuButton";

interface MenuProps {
  nodes: GLTFResult["nodes"];
}

export function Menu({ nodes }: MenuProps) {
  return (
    <group>
      <MenuButton
        name="About_Button_Third"
        geometry={nodes.About_Button_Third.geometry}
        material={nodes.About_Button_Third.material}
        position={[-1.236, 1.775, 2.027]}
        rotation={[0, 1.526, -1.506]}
        type="about"
      />
      <MenuButton
        name="Contact_Button_Third"
        geometry={nodes.Contact_Button_Third.geometry}
        material={nodes.Contact_Button_Third.material}
        position={[-1.236, 1.325, 2.027]}
        rotation={[0, 1.526, -1.631]}
        type="contact"
      />
      <MenuButton
        name="My_Work_Button_Third"
        geometry={nodes.My_Work_Button_Third.geometry}
        material={nodes.My_Work_Button_Third.material}
        position={[-1.236, 2.223, 2.027]}
        rotation={[-0.873, 1.506, -0.76]}
        type="works"
      />
    </group>
  );
}
