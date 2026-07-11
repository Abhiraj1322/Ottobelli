import { create } from "zustand";
import api from "../api/axios";

const useFavoritesStore = create((set, get) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  favorites: [],
  isLoading: false,
  error: null,

  // ─── Actions ──────────────────────────────────────────────────────────────

  // Fetch all favorites from backend
  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/api/favorites");
      set({ favorites: res.data.favorites || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch favorites", isLoading: false });
    }
  },

  // Add product to favorites
  addFavorite: async (productId) => {   
    try {
      await api.post(`/api/favorites/${productId}`);
      await get().fetchFavorites();
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to add favorite" });
    }
  },

  // Remove product from favorites
  removeFavorite: async (productId) => {
    try {
      await api.delete(`/api/favorites/${productId}`);
      // Remove from local state immediately (optimistic update)
      set((state) => ({
        favorites: state.favorites.filter((f) => f._id !== productId),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to remove favorite" });
    }
  },

  // Check if a product is in favorites
  isFavorite: (productId) => {
    return get().favorites.some((f) => f._id === productId);
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useFavoritesStore;
