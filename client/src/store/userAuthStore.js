import {create} from 'zustand'
import api from "../api/axios";

const useAuthStore = create((set) => ({
  // ─── State ────────────────────────────────────────────────────────────────
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  // ─── Actions ──────────────────────────────────────────────────────────────

  // Register new user
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      set({ user: res.data.user, isLoggedIn: true, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Registration failed", isLoading: false });
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/api/auth/login", { email, password });
      set({ user: res.data.user, isLoggedIn: true, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Login failed", isLoading: false });
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      set({ user: null, isLoggedIn: false });
    }
  },

  // Check if user is still logged in on app load / page refresh
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/api/auth/me");
      set({ user: res.data.user, isLoggedIn: true, isLoading: false });
    } catch (err) {
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;