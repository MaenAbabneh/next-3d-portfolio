import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { MathUtils, PerspectiveCamera } from "three";

export function ResponsiveInitialCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    if (camera instanceof PerspectiveCamera) {
      const clampedAspect = MathUtils.clamp(aspect, 0.6, 1.8);
      const t = (clampedAspect - 0.6) / (1.8 - 0.6);
      const fov = MathUtils.lerp(62, 45, t);

      // eslint-disable-next-line react-hooks/immutability
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [size.width, size.height, camera]);

  return null;
}
