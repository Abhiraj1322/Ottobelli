import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const EverydayPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch everyday categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories?section=everyday");
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
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
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1920&h=1080&fit=crop&auto=format)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(9,9,14,0.92) 40%, rgba(9,9,14,0.4) 100%)",
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
            Everyday Wear — Off The Rack
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
            Style that moves
            <br />
            with you.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm leading-relaxed mb-8"
            style={{ color: "rgba(245,240,232,0.55)", maxWidth: "480px" }}
          >
            The Everyday collection is built for life outside the boardroom.
            Premium materials, refined cuts, and effortless style — ready to
            wear the moment it arrives. No measurements. No waiting. Just great
            clothing, delivered.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => navigate("/everyday/shirts")}
            className="px-8 py-3.5 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-200 hover:opacity-90"
            style={{ background: "#C8A96E", color: "#1A1814" }}
          >
            Explore Everyday Wear →
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
          Browse by Category
        </motion.p>

        {isLoading ? (
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
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
                onClick={() => navigate(`/everyday/${cat.slug}`)}
              >
                {/* Background */}
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

                {/* Overlay */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: hoveredId === cat._id ? 0.3 : 0.6 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: "#09090E" }}
                />

                {/* Category number */}
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

                {/* Category name */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-white mb-1">
                    {cat.name}
                  </p>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <p
                      className="text-[8px] tracking-wider"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {cat.subcategories.length} styles
                    </p>
                  )}
                </div>

                {/* Hover — explore label */}
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
                    Explore →
                  </span>
                </motion.div>

                {/* Gold bottom border on hover */}
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

      {/* ── Why Everyday section ── */}
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
              title: "Premium Materials",
              desc: "Every piece is made from carefully selected fabrics — the same quality standards as our Classics line.",
            },
            {
              title: "Off The Rack",
              desc: "No measurements needed. Select your size, place your order, and wear it the moment it arrives.",
            },
            {
              title: "Effortless Style",
              desc: "Designed to look put-together in any setting — from casual weekends to smart-casual office days.",
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

export default EverydayPage;