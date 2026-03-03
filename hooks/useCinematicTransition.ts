import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function useCinematicTransition(materials: any, isDay: boolean) {
  useGSAP(() => {
    if (!materials) return;

    // 0 = نهار ، 1 = ليل
    const targetRatio = isDay ? 0.0 : 1.0;

    // المرور على الخامات الأربعة السينمائية وتحريكها معاً
    Object.values(materials.materials).forEach((mat: any) => {
      gsap.to(mat.uniforms.uMixRatio, {
        value: targetRatio,
        duration: 1.5,
        ease: "power2.inOut",
      });
    });
  }, [isDay, materials]);
}