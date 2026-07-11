import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import useAuthstore from "../store/userAuthStore"; // Adjust path to your store file
import { Link } from "react-router-dom";
export default function RegisterPage({ navigate, redirectTo }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  
  const register = useAuthstore((state) => state.register);
  const error = useAuthstore((state) => state.error);
  const isLoading = useAuthstore((state) => state.isLoading);
  const isAuthenticated = useAuthstore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo || { page: "landing" });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData.name, formData.email, formData.password);
  };

  return (
    <div className="min-h-screen bg-[#09090E] flex items-center justify-center px-4 font-sans selection:bg-stone-800">
      <div className="absolute top-6 left-8">
       <Link to="/" className="text-white/40 hover:text-white tracking-[0.25em] text-[10px] uppercase transition-colors inline-block">

       ← Return to Studio
       </Link>
      </div>

      <div className="w-full max-w-md bg-neutral-950 border border-stone-900/80 p-8 rounded-sm shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="text-center mb-8">
          <h2 className="text-white tracking-[0.35em] text-xl font-bold uppercase">OTTOBELLI</h2>
          <p className="text-white/40 tracking-[0.2em] text-[9px] mt-2 uppercase">Create Studio Account</p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-medium">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-neutral-900 border border-stone-800 focus:border-white/30 rounded-sm px-3 py-2.5 text-stone-200 text-sm tracking-wide focus:outline-none transition-colors"
              placeholder="Your Name"
            />
          </div>

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
            <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-medium">Password</label>
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
            {isLoading ? "Validating Session..." : "Register Identity"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-900/60 text-center">
          <button
            onClick={() => navigate({ page: "login" })}
            className="text-[10px] text-white/40 hover:text-white/70 tracking-widest uppercase transition-colors"
          >
            Already registered? Sign In
          </button>
        </div>
      </div>
    </div>
  );
}