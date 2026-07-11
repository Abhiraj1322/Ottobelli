import axios from "axios";

// Dynamically picks up your live Render backend URL or drops back to local testing if not set
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true, // sends cookies (accessToken, refreshToken) with every request
});
console.log("Current API URL:", import.meta.env.VITE_API_URL);
// ─── Request Interceptor ───────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent via withCredentials
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to obtain a fresh access token seamlessly using the refresh cookie
        await api.post("/api/auth/refresh");

        // Retry the original user request
        return api(originalRequest);
      } catch (refreshError) {
        // Both tokens expired — drop them to login safely
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;