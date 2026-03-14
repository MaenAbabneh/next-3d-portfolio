import { GLTFResult } from "@/types/room.types";
import { SocialItem } from "../SocailItem";

const SOCIAL_LINKS = {
  github: "https://github.com/maenababneh",
  linkedin: "https://linkedin.com/in/maenababneh",
  x: "https://x.com/maenababneh",
};

interface SocialButtonProps {
  nodes: GLTFResult["nodes"];
}

export function SocialButtons({ nodes }: SocialButtonProps) {
  return (
    <group name="Socials">
      {/* زر X */}
      <SocialItem
        name="X"
        geometry={nodes.X_Fourth_Raycaster_Pointer_Hover.geometry}
        material={nodes.X_Fourth_Raycaster_Pointer_Hover.material}
        position={[-0.023, 2.446, -1.096]}
        rotation={[-1.878, Math.PI / 2, 0]}
        url={SOCIAL_LINKS.x}
      />

      {/* زر LinkedIn */}
      <SocialItem
        name="LinkedIn"
        geometry={nodes.LinkedIn_Fourth_Raycaster_Pointer_Hover.geometry}
        material={nodes.LinkedIn_Fourth_Raycaster_Pointer_Hover.material}
        position={[-0.246, 2.449, -1.091]}
        rotation={[-1.878, Math.PI / 2, 0]}
        url={SOCIAL_LINKS.linkedin}
      />

      {/* زر GitHub */}
      <SocialItem
        name="GitHub"
        geometry={nodes.GitHub_Fourth_Raycaster_Pointer_Hover.geometry}
        material={nodes.GitHub_Fourth_Raycaster_Pointer_Hover.material}
        position={[-0.461, 2.449, -1.094]}
        rotation={[-1.878, Math.PI / 2, 0]}
        url={SOCIAL_LINKS.github}
      />
    </group>
  );
}
