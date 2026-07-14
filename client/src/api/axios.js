import axios from "axios";

// Dynamically picks up your live Render backend URL or drops back to local testing if not set
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  // ❌ REMOVED: withCredentials: true (since your backend no longer uses cookies)
});

// 🔒 ADDED: Request Interceptor
// This runs automatically right before Axios fires off any request to your backend
api.interceptors.request.use(
  (config) => {
    // Retrieve the token that you saved during login/registration
    const token = localStorage.getItem("token"); 

    if (token) {
      // Inject the token into the standard HTTP Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log("Current API URL:", import.meta.env.VITE_API_URL);

export default api;