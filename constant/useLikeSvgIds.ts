import { useId, useMemo } from "react";

export type LikeSvgIds = {
  activeGradient: string;
  inactiveGradient: string;
  likeButtonMask: string;
  activeGradientMask: string;
  tongueMask: string;
};

export const useLikeSvgIds = (): LikeSvgIds => {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return useMemo(
    () => ({
      activeGradient: `active-gradient-${instanceId}`,
      inactiveGradient: `inactive-gradient-${instanceId}`,
      likeButtonMask: `like-button-mask-${instanceId}`,
      activeGradientMask: `active-gradient-mask-${instanceId}`,
      tongueMask: `tongue-mask-${instanceId}`,
    }),
    [instanceId],
  );
};
