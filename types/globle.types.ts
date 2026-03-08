import * as THREE from "three";

export interface MenuButtonProps {
  name?: string;
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
  position: [number, number, number];
  rotation: [number, number, number];
  type: "about" | "works" | "contact" | "articles";
}
