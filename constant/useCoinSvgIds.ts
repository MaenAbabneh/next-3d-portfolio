import { useId, useMemo } from "react";

export type CoinSvgIds = {
  fillClip: string;
  goldGlassGrad: string;
  liquidGoldGrad: string;
  highlightGrad: string;
  highlightGradReverse: string;
  tongueMask: string;
};

export const useCoinSvgIds = (): CoinSvgIds => {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return useMemo(
    () => ({
      fillClip: `fill-clip-${instanceId}`,
      goldGlassGrad: `gold-glass-grad-${instanceId}`,
      liquidGoldGrad: `liquid-gold-grad-${instanceId}`,
      highlightGrad: `highlight-grad-${instanceId}`,
      highlightGradReverse: `highlight-grad-rev-${instanceId}`,
      tongueMask: `tongue-mask-${instanceId}`,
    }),
    [instanceId],
  );
};
