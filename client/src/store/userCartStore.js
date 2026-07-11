import { create } from "zustand";
import api from "../api/axios";

const useCartStore = create((set, get) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  items: [],
  total: 0,
  isLoading: false,
  error: null,


  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/api/cart");
      set({
        items: res.data.cart.items || [],
        total: res.data.total || 0,
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch cart", isLoading: false });
    }
  },

  // Add item to cart
  addToCart: async (productId, profileId, customizationSelectionId = null, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/api/cart", {
        productId,
        profileId,
        customizationSelectionId,
        quantity,
      });

      // Refetch cart to get updated data with populated fields
      await get().fetchCart();
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to add to cart", isLoading: false });
    }
  },

  // Update item quantity
  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/api/cart/${itemId}`, { quantity });
      await get().fetchCart();
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update cart", isLoading: false });
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/api/cart/${itemId}`);
      await get().fetchCart();
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to remove item", isLoading: false });
    }
  },

  // Clear entire cart
  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      await api.delete("/api/cart/clear");
      set({ items: [], total: 0, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to clear cart", isLoading: false });
    }
  },

  // Get total number of items in cart (for navbar badge)
  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useCartStore;