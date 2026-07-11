import React from 'react'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from '../api/axios';
const ClassicsPage = () => {
    const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
// Fetch classics categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Querying the classics split context from your controller endpoints
        const res = await api.get("/api/categories?section=classics");
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch classics categories:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div
      className="min-h-screen pt-[46px]"
      style={{ background: "#09090E", fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* ── Hero Section ── */}
      <div
        className="relative flex flex-col justify-center px-16 py-24 overflow-hidden"
        style={{ minHeight: "55vh" }}
      >
        {/* Background image - Premium Tailoring Aesthetics */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1920&h=1080&fit=crop&auto=format)",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(9,9,14,0.95) 40%, rgba(9,9,14,0.5) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[9px] tracking-[0.45em] uppercase mb-4 font-bold"
            style={{ color: "#C8A96E" }}
          >
            Classics Collection — Made to Measure
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-white leading-tight mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 5vw, 64px)",
            }}
          >
            Timeless Tailoring.
            <br />
            Flawless Fit.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(245,240,232,0.55)", maxWidth: "480px" }}
          >
            Our Classics line represents the peak of custom menswear. Crafted from the 
            world's finest mills, each piece is individually constructed to fit your specific 
            profile. Experience sartorial architectural lines engineered exclusively for you.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => navigate("/classics/suits")}
            className="px-8 py-3.5 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-200 hover:opacity-90"
            style={{ background: "#C8A96E", color: "#1A1814" }}
          >
            Begin Custom Order →
          </motion.button>
        </div>
      </div>

      {/* ── Subcategory Cards ── */}
      <div className="px-16 py-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[9px] tracking-[0.45em] uppercase mb-10 font-bold"
          style={{ color: "#C8A96E" }}
        >
          Browse Bespoke Categories
        </motion.p>

        {isLoading ? (
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-sm animate-pulse"
                style={{
                  width: "200px",
                  height: "300px",
                  background: "rgba(255,255,255,0.05)",
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex-shrink-0 cursor-pointer relative overflow-hidden"
                style={{
                  width: "200px",
                  height: "300px",
                  scrollSnapAlign: "start",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                }}
                onMouseEnter={() => setHoveredId(cat._id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigate(`/classics/${cat.slug}`)}
              >
                {/* Background Image Container */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: hoveredId === cat._id ? 1.06 : 1 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{
                    background: cat.image
                      ? `url(${cat.image}) center/cover`
                      : `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
                    backgroundColor: "#111118",
                  }}
                />

                {/* Ambient Dark Overlay overlay */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: hoveredId === cat._id ? 0.3 : 0.6 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: "#09090E" }}
                />

                {/* Big Background Row Enumeration */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold opacity-10"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "80px",
                    color: "#FFFFFF",
                    lineHeight: 1,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Category Identity Labels */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-white mb-1">
                    {cat.name}
                  </p>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <p
                      className="text-[8px] tracking-wider"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {cat.subcategories.length} silhouettes
                    </p>
                  )}
                </div>

                {/* Hover Interactive Tags */}
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{
                    opacity: hoveredId === cat._id ? 1 : 0,
                    y: hoveredId === cat._id ? 0 : -6,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <span
                    className="text-[8px] tracking-[0.35em] uppercase"
                    style={{ color: "#C8A96E" }}
                  >
                    Configure →
                  </span>
                </motion.div>

                {/* Luxury border lines animation */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0"
                  animate={{ scaleX: hoveredId === cat._id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: "2px",
                    background: "#C8A96E",
                    transformOrigin: "left",
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Why Classics Premium Grid ── */}
      <div
        className="mx-16 mb-16 p-12"
        style={{
          border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div className="grid grid-cols-3 gap-12">
          {[
            {
              title: "Bespoke Drafted",
              desc: "Every cut patterns from individual human inputs. Built distinctively to complement and contour your physical silhouette seamlessly.",
            },
            {
              title: "World Class Mills",
              desc: "Exclusively utilizing ultra-fine merino wools, breathable silken blends, and traditional structural canvas builds designed to last lifetimes.",
            },
            {
              title: "Fit Right Guarantee",
              desc: "Includes our comprehensive digital mapping alteration support context. If your fit profiles shift, local alteration adjustments are fully covered.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="w-6 h-px mb-5" style={{ background: "#C8A96E" }} />
              <h3
                className="text-sm font-bold text-white mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassicsPage