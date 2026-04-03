"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { useGameStore } from "@/store/useGameStore";
import { useOverlayStore } from "@/store/useOverlayStore";
import { useArticleStore } from "@/store/useArticleStore";
import { resolveArticleIdFromParam } from "@/constant/articlesData";

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

    const id = resolveArticleIdFromParam(raw);
    if (id == null) return;

    didRunRef.current = true;
    openOverlay("articles");
    openArticle(id);
  }, [openArticle, openOverlay, searchParams, started]);

  return null;
}
