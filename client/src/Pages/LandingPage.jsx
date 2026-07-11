import { useState, useRef } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
export default function LandingPage() { 
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-hidden select-none bg-[#09090E] relative"
      onMouseMove={handleMouseMove}
    >
      {/* Classics — top half */}
      <motion.div
        className="relative w-full h-[50vh] overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered("classics")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate("/classics")}
      >
        <motion.div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1920&h=960&fit=crop&auto=format')] bg-cover bg-[center_20%]"
          animate={{ scale: hovered === "classics" ? 1.04 : 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.div
          className="absolute inset-0 bg-[#09090E]"
          animate={{ opacity: hovered === "classics" ? 0.45 : 0.7 }}
          transition={{ duration: 0.5 }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(9,9,14,0.6)_100%)]" />

        <span className="absolute top-7 left-9 z-10 font-sans font-medium tracking-[0.35em] text-white/40 text-[10px] uppercase">
          Classics Collection
        </span>
        <span className="absolute top-7 right-9 z-10 font-sans font-medium tracking-[0.25em] text-white/40 text-[10px] uppercase">
          Made to Measure
        </span>

        <motion.div
          className="absolute bottom-8 left-9 z-10"
          animate={{ opacity: hovered === "classics" ? 1 : 0, y: hovered === "classics" ? 0 : 6 }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-sans font-medium text-[10px] tracking-[0.4em] text-white/70 uppercase flex items-center gap-2">
            Explore Collection
            <span className="inline-block">→</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Center OTTOBELLI wordmark */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <motion.div
          className="text-center"
          style={{
            transform: `perspective(800px) rotateX(${mouse.y * -4}deg) rotateY(${mouse.x * 4}deg)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <h1 className="text-white tracking-[0.45em] font-sans font-bold leading-none text-[clamp(28px,4.5vw,64px)]">
            OTTOBELLI
          </h1>
          <p className="text-white/40 tracking-[0.55em] mt-3 font-sans font-get-normal text-[9px] uppercase">
            Your Style. Perfected.
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-white/20" />
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div className="h-px w-12 bg-white/20" />
          </div>
        </motion.div>
      </div>

      {/* Hairline divider */}
      <div className="absolute left-0 right-0 z-10 top-[50vh] h-[1px] bg-white/10" />

      {/* Everyday Wear — bottom half */}
      <motion.div
        className="relative w-full h-[50vh] overflow-hidden cursor-pointer"
        onMouseEnter={() => setHovered("everyday")}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate( "/everyday" )}
      >
        <motion.div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1920&h=960&fit=crop&auto=format')] bg-cover bg-[center_60%]"
          animate={{ scale: hovered === "everyday" ? 1.04 : 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.div
          className="absolute inset-0 bg-[#09090E]"
          animate={{ opacity: hovered === "everyday" ? 0.45 : 0.72 }}
          transition={{ duration: 0.5 }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(9,9,14,0.6)_100%)]" />

        <span className="absolute bottom-7 left-9 z-10 font-sans font-medium tracking-[0.35em] text-white/40 text-[10px] uppercase">
          Everyday Wear
        </span>
        <span className="absolute bottom-7 right-9 z-10 font-sans font-medium tracking-[0.25em] text-white/40 text-[10px] uppercase">
          Off The Rack
        </span>

        <motion.div
          className="absolute top-8 right-9 z-10"
          animate={{ opacity: hovered === "everyday" ? 1 : 0, y: hovered === "everyday" ? 0 : -6 }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-sans font-medium text-[10px] tracking-[0.4em] text-white/70 uppercase flex items-center gap-2">
            Explore Collection
            <span className="inline-block">→</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}