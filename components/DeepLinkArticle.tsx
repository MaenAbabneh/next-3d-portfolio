"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { useGameStore } from "@/store/useGameStore";
import { useOverlayStore } from "@/store/useOverlayStore";
import { useArticleStore } from "@/store/useArticleStore";

export default function DeepLinkArticle() {
  const started = useGameStore((s) => s.started);
  const openOverlay = useOverlayStore((s) => s.openOverlay);
  const openArticle = useArticleStore((s) => s.openArticle);

  const searchParams = useSearchParams();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (!started) return;
    if (didRunRef.current) return;

    const raw = searchParams.get("article");
    if (!raw) return;

    const id = Number(raw);
    if (!Number.isFinite(id)) return;

    didRunRef.current = true;
    openOverlay("articles");
    openArticle(id);
  }, [openArticle, openOverlay, searchParams, started]);

  return null;
}
