import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Check, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useCartStore from "../../store/userCartStore";

const ProfileSelectorModal = ({
  product,
  customizationSelectionId = null,
  onClose,
  onAdded,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
const [showProfileModal, setShowProfileModal] = useState(false);
const [customizationId, setCustomizationId] = useState(null);


  // Fetch user profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get("/api/profiles");
        setProfiles(res.data.profiles);
        // Auto select first profile
        if (res.data.profiles.length > 0) {
          setSelectedProfileId(res.data.profiles[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleAddToCart = async () => {
    if (!selectedProfileId) return;
    setIsAdding(true);
    try {
      await addToCart(
        product._id,
        selectedProfileId,
        customizationSelectionId,
        1
      );
      onAdded();
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsAdding(false);
    }
  };

  // Count filled measurements
  const getFilledCount = (measurements) => {
    return Object.values(measurements || {}).filter(
      (v) => v !== null && v !== undefined
    ).length;
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: "rgba(9,9,14,0.88)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full mx-4 overflow-hidden"
        style={{
          maxWidth: "480px",
          background: "#F5F0E8",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-7 py-5"
          style={{ background: "#1A1814" }}
        >
          <div>
            <p
              className="text-[8px] tracking-[0.4em] uppercase font-bold mb-1"
              style={{ color: "#C8A96E" }}
            >
              Select Profile
            </p>
            <h3
              className="text-sm font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Who is this for?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Product summary ── */}
        <div
          className="flex items-center gap-4 px-7 py-4"
          style={{
            background: "#EDE8DE",
            borderBottom: "1px solid rgba(26,24,20,0.1)",
          }}
        >
          {/* Product image */}
          <div
            className="flex-shrink-0 overflow-hidden"
            style={{ width: "44px", height: "56px", background: "#D4CCBC" }}
          >
            {product.images?.[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <p
              className="text-xs font-bold mb-0.5"
              style={{ color: "#1A1814" }}
            >
              {product.name}
            </p>
            <p
              className="text-sm font-bold"
              style={{
                color: "#1A1814",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              ${product.price?.toLocaleString()} CAD
            </p>
          </div>
        </div>

        {/* ── Profile list ── */}
        <div className="p-7">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse"
                  style={{ background: "rgba(26,24,20,0.08)" }}
                />
              ))}
            </div>
          ) : profiles.length === 0 ? (
            // ── No Profiles ──
            <div className="text-center py-6">
              <Ruler
                size={32}
                strokeWidth={1}
                className="mx-auto mb-3"
                style={{ color: "rgba(26,24,20,0.25)" }}
              />
              <p
                className="text-sm font-bold mb-1"
                style={{ color: "#1A1814" }}
              >
                No profiles yet
              </p>
              <p
                className="text-[9px] mb-5 tracking-wider"
                style={{ color: "#9A9080" }}
              >
                Create a profile to save your measurements
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate("/account/profiles");
                }}
                className="px-5 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:opacity-90"
                style={{ background: "#1A1814", color: "#F5F0E8" }}
              >
                Create Profile
              </button>
            </div>
          ) : (
            <>
              <p
                className="text-[9px] tracking-[0.3em] uppercase font-bold mb-4"
                style={{ color: "#9A9080" }}
              >
                Select a profile
              </p>

              {/* Profile options */}
              <div className="space-y-2 mb-6">
                {profiles.map((profile) => {
                  const isSelected = selectedProfileId === profile._id;
                  const filled = getFilledCount(profile.measurements);

                  return (
                    <button
                      key={profile._id}
                      onClick={() => setSelectedProfileId(profile._id)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all"
                      style={{
                        background: isSelected ? "#1A1814" : "rgba(26,24,20,0.05)",
                        border: isSelected
                          ? "2px solid #1A1814"
                          : "2px solid rgba(26,24,20,0.12)",
                      }}
                    >
                      {/* Avatar */}
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          background: isSelected ? "#C8A96E" : "rgba(26,24,20,0.15)",
                          color: isSelected ? "#1A1814" : "#7A7260",
                        }}
                      >
                        {profile.displayName[0].toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <p
                          className="text-xs font-bold mb-0.5"
                          style={{ color: isSelected ? "#F5F0E8" : "#1A1814" }}
                        >
                          {profile.displayName}
                        </p>
                        <p
                          className="text-[9px] tracking-wider"
                          style={{
                            color: isSelected
                              ? "rgba(245,240,232,0.5)"
                              : "#9A9080",
                          }}
                        >
                          {filled} / 14 measurements filled
                        </p>
                      </div>

                      {/* Check */}
                      {isSelected && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "#C8A96E" }}
                        >
                          <Check size={11} color="#1A1814" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Add new profile link */}
              <button
                onClick={() => {
                  onClose();
                  navigate("/account/profiles");
                }}
                className="flex items-center gap-2 text-[9px] tracking-wider font-bold transition-colors hover:opacity-70 mb-6"
                style={{ color: "#C8A96E" }}
              >
                <Plus size={11} />
                Add New Profile
              </button>

              {/* Measurements warning */}
              {selectedProfileId && (() => {
                const selected = profiles.find((p) => p._id === selectedProfileId);
                const filled = getFilledCount(selected?.measurements);
                if (filled < 14) {
                  return (
                    <div
                      className="flex items-start gap-3 px-4 py-3 mb-5"
                      style={{
                        background: "rgba(200,169,110,0.08)",
                        border: "1px solid rgba(200,169,110,0.25)",
                      }}
                    >
                      <Ruler size={13} style={{ color: "#C8A96E", flexShrink: 0, marginTop: 1 }} />
                      <div>
                        <p
                          className="text-[9px] font-bold tracking-wider mb-1"
                          style={{ color: "#C8A96E" }}
                        >
                          Measurements Incomplete
                        </p>
                        <p
                          className="text-[9px] leading-relaxed"
                          style={{ color: "#7A7260" }}
                        >
                          {filled}/14 filled. You can still add to cart — complete measurements before your order is finalized.
                        </p>
                        <button
                          onClick={() => {
                            onClose();
                            navigate(
                              `/account/profiles/${selectedProfileId}/measurements`
                            );
                          }}
                          className="text-[9px] font-bold tracking-wider underline underline-offset-2 mt-1 transition-colors hover:opacity-70"
                          style={{ color: "#C8A96E" }}
                        >
                          Complete Measurements →
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedProfileId || isAdding}
                className="w-full py-4 text-xs font-bold tracking-[0.3em] uppercase transition-all duration-200 hover:opacity-90 disabled:opacity-40"
                style={{ background: "#1A1814", color: "#F5F0E8" }}
              >
                {isAdding ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border border-[#F5F0E8] border-t-transparent rounded-full animate-spin" />
                    Adding to Cart...
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSelectorModal;