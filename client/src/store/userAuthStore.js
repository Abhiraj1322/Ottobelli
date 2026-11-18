import { create } from 'zustand'
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
      // If your backend register does NOT return a token, users must log in manually after.
      // If it DOES return a token, we save it here just like in the login action.
      const res = await api.post("/api/auth/register", { name, email, password });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      
      set({ user: res.data.user, isLoggedIn: !!res.data.token, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Registration failed", isLoading: false });
    }
  },

// Login
// Google Login
googleLogin: async (credential) => {
  set({ isLoading: true, error: null });

  try {
    // Send Google's ID token to your backend
    const res = await api.post("/api/auth/google", {
      credential,
    });

    // Save your application's JWT
    localStorage.setItem("token", res.data.token);

    // Save user information
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // Update Zustand state
    set({
      user: res.data.user,
      isLoggedIn: true,
      isLoading: false,
      error: null,
    });

    return res.data.user;

  } catch (err) {
    set({
      error: err.response?.data?.message || "Google login failed",
      isLoading: false,
    });

    throw err;
  }
},



  // Logout
logout: () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  set({
    user: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
  });
},
  // Check if user is still logged in on app load / page refresh
  checkAuth: async () => {
    // If there is no token in localStorage, don't even bother calling the API
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, isLoggedIn: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await api.get("/api/auth/me");
      set({ user: res.data.user, isLoggedIn: true, isLoading: false, error: null });
    } catch (err) {
      // If the token is expired/invalid, clean up storage
      localStorage.removeItem("token");
      set({ user: null, isLoggedIn: false, isLoading: false, error: null });
    }
  },

  // Clear error manually if needed
  clearError: () => set({ error: null }),
}));

export default useAuthStore;  