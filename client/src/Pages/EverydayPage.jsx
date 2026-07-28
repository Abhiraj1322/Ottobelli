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
      className="min-h-screen pt-[46px] w-full overflow-hidden"
      style={{ background: "#FDFBF7", fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* ── Hero Section ── */}
      <div
        className="relative flex flex-col justify-center px-6 sm:px-12 md:px-16 py-16 md:py-24 overflow-hidden"
        style={{ minHeight: "55vh" }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1920&h=1080&fit=crop&auto=format)",
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
          }}
        />

        {/* Dark Overlay for Hero image readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(18,16,12,0.92) 40%, rgba(18,16,12,0.4) 100%)",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[9px] tracking-[0.45em] uppercase mb-4 font-bold"
            style={{ color: "#C5A059" }}
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
              fontSize: "clamp(32px, 5vw, 64px)",
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
            className="text-xs sm:text-sm leading-relaxed mb-8"
            style={{ color: "rgba(253,251,247,0.8)", maxWidth: "480px" }}
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
            className="w-full sm:w-auto text-center px-8 py-3.5 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-200 hover:opacity-90 cursor-pointer shadow-sm"
            style={{ background: "#C5A059", color: "#1A1814" }}
          >
            Explore Everyday Wear →
          </motion.button>
        </div>
      </div>

      {/* ── Subcategory Cards ── */}
      <div className="w-full bg-[#FDFBF7] px-6 sm:px-12 md:px-16 py-12 md:py-16 border-t border-b border-[#E8E2D5]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[9px] tracking-[0.45em] uppercase mb-8 md:mb-10 font-bold"
          style={{ color: "#C5A059" }}
        >
          Browse by Category
        </motion.p>

        {isLoading ? (
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-sm animate-pulse"
                style={{
                  width: "220px",
                  height: "320px",
                  background: "#F4F0E6",
                  border: "1px solid #E8E2D5",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="-mx-6 sm:-mx-12 md:-mx-16 px-6 sm:px-12 md:px-16">
            <div
              className="flex gap-5 overflow-x-auto pb-4 scrollbar-none"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {categories.map((cat, i) => (
                <motion.div
                  key={cat._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex-shrink-0 cursor-pointer relative overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300"
                  style={{
                    width: "220px",
                    height: "320px",
                    scrollSnapAlign: "start",
                    border: "1px solid #E8E2D5",
                    borderRadius: "2px",
                    backgroundColor: "#F7F4EC",
                  }}
                  onMouseEnter={() => setHoveredId(cat._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => navigate(`/everyday/${cat.slug}`)}
                >
                  {/* Background Image Container */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: hoveredId === cat._id ? 1.06 : 1 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                      background: cat.image
                        ? `url(${cat.image}) center/cover`
                        : `linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 100%)`,
                      backgroundColor: "#F4F0E6",
                    }}
                  />

                  {/* Warm Cream Ambient Overlay */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{ opacity: hoveredId === cat._id ? 0.08 : 0.3 }}
                    transition={{ duration: 0.4 }}
                    style={{ background: "#FDFBF7" }}
                  />

                  {/* Category Number Overlay */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold opacity-15 select-none pointer-events-none"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "80px",
                      color: "#1A1814",
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Category Labels with Cream Fade Gradient */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/85 to-transparent">
                    <p className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#1A1814] mb-1">
                      {cat.name}
                    </p>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <p
                        className="text-[8px] tracking-wider font-semibold"
                        style={{ color: "#7A7365" }}
                      >
                        {cat.subcategories.length} styles
                      </p>
                    )}
                  </div>

                  {/* Hover Action Tag */}
                  <motion.div
                    className="absolute top-4 right-4 z-10"
                    animate={{
                      opacity: hoveredId === cat._id ? 1 : 0,
                      y: hoveredId === cat._id ? 0 : -6,
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <span
                      className="text-[8px] tracking-[0.35em] uppercase font-bold"
                      style={{ color: "#C5A059" }}
                    >
                      Explore →
                    </span>
                  </motion.div>

                  {/* Gold Bottom Border Accent */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 z-20"
                    animate={{ scaleX: hoveredId === cat._id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      height: "2px",
                      background: "#C5A059",
                      transformOrigin: "left",
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Why Everyday Section ── */}
      <div className="mx-6 sm:mx-12 md:mx-16 my-16 p-8 md:p-12 border border-[#E8E2D5] bg-[#F4F0E6] rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
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
              <div className="w-6 h-px mb-4 md:mb-5 bg-[#C5A059]" />
              <h3 className="text-sm font-bold text-[#1A1814] mb-3 font-serif">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#635E54]">
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