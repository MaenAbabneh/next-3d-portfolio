import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { RoomMaterialBundle } from "./useRoomMaterials";

export function useCinematicTransition(
  materials: RoomMaterialBundle | null,
  isNight: boolean,
) {
  useGSAP(() => {
    if (!materials) return;

    // 0 = نهار ، 1 = ليل
    const targetRatio = isNight ? 1.0 : 0.0;

    // المرور على الخامات الأربعة السينمائية وتحريكها معاً
    Object.values(materials.materials).forEach((mat) => {
      gsap.to(mat.uniforms.uMixRatio, {
        value: targetRatio,
        duration: 1.5,
        ease: "power2.inOut",
      });
    });
  }, [isNight, materials]);
}
