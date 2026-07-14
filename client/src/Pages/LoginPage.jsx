import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import useAuthStore from "../store/userAuthStore"; // Path matches your Capitalized store file
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({ redirectTo }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Destructure exactly what matches your Zustand store schema
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const clearError = useAuthStore((state) => state.clearError);
console.log(isLoading)
  // Clear any existing auth errors when the user switches pages/views
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect automatically when authentication changes to true
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectTo || "/"); // Fallback to your main layout route
    }
  }, [isLoggedIn, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <div className="min-h-screen bg-[#09090E] flex items-center justify-center px-4 font-sans selection:bg-stone-800">
      {/* Absolute Header Navigation */}
      <div className="absolute top-6 left-8">
        <Link to="/" className="text-white/40 hover:text-white tracking-[0.25em] text-[10px] uppercase transition-colors inline-block">
          ← Return to Studio
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-neutral-950 border border-stone-900/80 p-8 rounded-sm shadow-2xl relative overflow-hidden">
        {/* Sleek top ambient accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Branding Headers */}
        <div className="text-center mb-8">
          <h2 className="text-white tracking-[0.35em] text-xl font-bold uppercase">OTTOBELLI</h2>
          <p className="text-white/40 tracking-[0.2em] text-[9px] mt-2 uppercase">Access Studio Account</p>
        </div>

        {/* Dynamic Error Messaging Container */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-5 p-3 bg-red-950/20 border border-red-900/40 rounded-sm text-center"
            >
              <p className="text-red-400 text-[11px] tracking-wider font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-medium">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-neutral-900 border border-stone-800 focus:border-white/30 rounded-sm px-3 py-2.5 text-stone-200 text-sm tracking-wide focus:outline-none transition-colors"
              placeholder="name@domain.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] uppercase tracking-widest text-white/50 font-medium">Password</label>
              <Link 
                to="/forgot-password" 
                className="text-[9px] text-white/30 hover:text-white/60 tracking-wider uppercase transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-neutral-900 border border-stone-800 focus:border-white/30 rounded-sm px-3 py-2.5 text-stone-200 text-sm tracking-wide focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-stone-100 hover:bg-white text-neutral-950 font-medium tracking-[0.25em] text-[11px] uppercase py-3 rounded-sm transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Verify Identity"}
          </button>
        </form>

        {/* Footer Toggle Link */}
        <div className="mt-6 pt-6 border-t border-stone-900/60 text-center">
          <button
            onClick={() => navigate("/register")}
            className="text-[10px] text-white/40 hover:text-white/70 tracking-widest uppercase transition-colors"
          >
            New to Studio? Create Account
          </button>
        </div>
      </div>
    </div>
  );
}