"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ArticleState {
  activeArticleId: number | null;
  isSidebarOpen: boolean;

  searchQuery: string;
  selectedCategory: string | null;
  bookmarkedOnly: boolean;

  viewsDeltaById: Record<number, number>;
  lastViewAtById: Record<number, number>;

  viewsById: Record<number, number>;
  likesById: Record<number, number>;

  pendingViewsById: Record<number, number>;
  pendingLikesById: Record<number, number>;

  bookmarkedIds: Record<number, true>;

  openArticle: (id: number) => void;
  closeArticle: () => void;
  setActiveArticleId: (id: number | null) => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  toggleBookmark: (id: number) => void;

  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setBookmarkedOnly: (only: boolean) => void;
  resetListFilters: () => void;

  fetchViews: (id: number) => Promise<void>;
  incrementViews: (id: number) => Promise<void>;

  fetchLikes: (id: number) => Promise<void>;
  incrementLikesBy: (id: number, by?: number) => Promise<void>;
}

export const useArticleStore = create<ArticleState>()(
  persist(
    (set, get) => ({
      activeArticleId: null,
      isSidebarOpen: false,

      searchQuery: "",
      selectedCategory: null,
      bookmarkedOnly: false,

      viewsDeltaById: {},
      lastViewAtById: {},

      viewsById: {},
      likesById: {},

      pendingViewsById: {},
      pendingLikesById: {},

      bookmarkedIds: {},

      openArticle: (id) =>
        set({
          activeArticleId: id,
          isSidebarOpen: true,
        }),
      closeArticle: () => set({ activeArticleId: null, isSidebarOpen: false }),
      setActiveArticleId: (id) => set({ activeArticleId: id }),
      openSidebar: () => set({ isSidebarOpen: true }),
      closeSidebar: () => set({ isSidebarOpen: false }),

      toggleBookmark: (id) => {
        set((state) => {
          const next = { ...state.bookmarkedIds };
          if (next[id]) delete next[id];
          else next[id] = true;
          return { bookmarkedIds: next };
        });
      },

      setSearchQuery: (query) =>
        set({ searchQuery: typeof query === "string" ? query : "" }),
      setSelectedCategory: (category) =>
        set({
          selectedCategory: category && category.trim() ? category : null,
        }),
      setBookmarkedOnly: (only) => set({ bookmarkedOnly: !!only }),
      resetListFilters: () =>
        set({ searchQuery: "", selectedCategory: null, bookmarkedOnly: false }),

      fetchViews: async (id) => {
        try {
          const res = await fetch(`/api/articles/${id}/views`, {
            method: "GET",
            cache: "no-store",
          });
          if (!res.ok) return;

          const data = (await res.json()) as { views?: number };
          if (typeof data.views !== "number" || !Number.isFinite(data.views)) {
            return;
          }

          const views = data.views;

          set((state) => ({
            viewsById: {
              ...state.viewsById,
              [id]: views,
            },
          }));
        } catch {
          // ignore network errors
        }
      },

      incrementViews: async (id) => {
        const now = Date.now();
        const last = get().lastViewAtById[id] ?? 0;
        if (now - last < 400) return;

        // Optimistic UI: show +1 immediately.
        set((state) => ({
          pendingViewsById: {
            ...state.pendingViewsById,
            [id]: (state.pendingViewsById[id] ?? 0) + 1,
          },
        }));

        set((state) => ({
          lastViewAtById: {
            ...state.lastViewAtById,
            [id]: now,
          },
        }));

        try {
          const res = await fetch(`/api/articles/${id}/views`, {
            method: "POST",
            cache: "no-store",
          });

          if (!res.ok) {
            throw new Error("views increment failed");
          }

          const data = (await res.json()) as { views?: number };
          if (typeof data.views !== "number" || !Number.isFinite(data.views)) {
            throw new Error("invalid response");
          }

          const views = data.views;

          set((state) => ({
            viewsById: {
              ...state.viewsById,
              [id]: views,
            },
            pendingViewsById: (() => {
              const next = { ...state.pendingViewsById };
              delete next[id];
              return next;
            })(),
          }));
        } catch {
          // Fallback: keep local counter working even without Redis.
          set((state) => ({
            pendingViewsById: (() => {
              const current = state.pendingViewsById[id] ?? 0;
              const nextValue = Math.max(0, current - 1);
              const next = { ...state.pendingViewsById };
              if (nextValue === 0) delete next[id];
              else next[id] = nextValue;
              return next;
            })(),
            viewsDeltaById: {
              ...state.viewsDeltaById,
              [id]: (state.viewsDeltaById[id] ?? 0) + 1,
            },
          }));
        }
      },

      fetchLikes: async (id) => {
        try {
          const res = await fetch(`/api/articles/${id}/likes`, {
            method: "GET",
            cache: "no-store",
          });
          if (!res.ok) return;

          const data = (await res.json()) as { likes?: number };
          if (typeof data.likes !== "number" || !Number.isFinite(data.likes)) {
            return;
          }

          const likes = data.likes;

          set((state) => ({
            likesById: {
              ...state.likesById,
              [id]: likes,
            },
          }));
        } catch {
          // ignore network errors
        }
      },

      incrementLikesBy: async (id, by = 1) => {
        const safeBy =
          typeof by === "number" && Number.isFinite(by) ? Math.trunc(by) : 1;
        const delta = safeBy === 0 ? 1 : safeBy;

        // Optimistic UI: apply delta immediately (supports decrement as well).
        set((state) => ({
          pendingLikesById: {
            ...state.pendingLikesById,
            [id]: (state.pendingLikesById[id] ?? 0) + delta,
          },
        }));

        try {
          const res = await fetch(`/api/articles/${id}/likes`, {
            method: "POST",
            cache: "no-store",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({ by: delta }),
          });

          if (!res.ok) {
            throw new Error("likes increment failed");
          }

          const data = (await res.json()) as { likes?: number };
          if (typeof data.likes !== "number" || !Number.isFinite(data.likes)) {
            throw new Error("invalid response");
          }

          const likes = data.likes;

          set((state) => ({
            likesById: {
              ...state.likesById,
              [id]: likes,
            },
            pendingLikesById: (() => {
              const next = { ...state.pendingLikesById };
              delete next[id];
              return next;
            })(),
          }));
        } catch {
          // Roll back optimistic UI on network errors.
          set((state) => ({
            pendingLikesById: (() => {
              const current = state.pendingLikesById[id] ?? 0;
              const nextValue = current - delta;
              const next = { ...state.pendingLikesById };
              if (nextValue === 0) delete next[id];
              else next[id] = nextValue;
              return next;
            })(),
          }));
        }
      },
    }),
    {
      name: "portfolio:article-views",
      partialize: (state) => ({
        viewsDeltaById: state.viewsDeltaById,
        bookmarkedIds: state.bookmarkedIds,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<ArticleState>) ?? {};
        return {
          ...currentState,
          ...persisted,
          viewsDeltaById: persisted.viewsDeltaById ?? {},
          bookmarkedIds: persisted.bookmarkedIds ?? {},
          lastViewAtById: {},
          viewsById: {},
          likesById: {},
          pendingViewsById: {},
          pendingLikesById: {},
        };
      },
    },
  ),
);
