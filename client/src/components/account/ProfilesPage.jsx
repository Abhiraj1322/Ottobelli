import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Ruler, Trash2, ChevronRight } from "lucide-react";
import api from "../../api/axios";

const ProfilesPage = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get("/api/profiles");
        setProfiles(res.data.profiles);
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // Create profile
  const handleCreate = async () => {
    if (!newProfileName.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.post("/api/profiles", {
        displayName: newProfileName.trim(),
      });
      setProfiles((prev) => [...prev, res.data.profile]);
      setNewProfileName("");
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to create profile:", err);
    } finally {
      setIsCreating(false);
    }
  };

  // Delete profile
  const handleDelete = async (profileId) => {
    setDeletingId(profileId);
    try {
      await api.delete(`/api/profiles/${profileId}`);
      setProfiles((prev) => prev.filter((p) => p._id !== profileId));
    } catch (err) {
      console.error("Failed to delete profile:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Count filled measurements
  const getFilledCount = (measurements) => {
    return Object.values(measurements || {}).filter(
      (v) => v !== null && v !== undefined
    ).length;
  };

  return (
    <div
      className="min-h-screen pt-[46px]"
      style={{ background: "#09090E", fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-2xl mx-auto px-8 py-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4 text-[9px] tracking-[0.25em]">
            <button
              onClick={() => navigate("/account")}
              className="transition-colors hover:text-white/70"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              ACCOUNT
            </button>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>PROFILES</span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-[9px] tracking-[0.45em] uppercase mb-3 font-bold"
                style={{ color: "#C8A96E" }}
              >
                Measurement Profiles
              </p>
              <h1
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                My Profiles
              </h1>
            </div>

            {/* Add profile button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:opacity-90"
              style={{ background: "#C8A96E", color: "#1A1814" }}
            >
              <Plus size={13} />
              Add Profile
            </button>
          </div>

          <div
            className="mt-6 h-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
        </motion.div>

        {/* ── Loading ── */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse"
                style={{ background: "rgba(255,255,255,0.03)" }}
              />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          // ── Empty State ──
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Ruler
              size={40}
              strokeWidth={1}
              color="rgba(255,255,255,0.1)"
              className="mb-5"
            />
            <p
              className="text-white font-bold text-lg mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              No profiles yet
            </p>
            <p
              className="text-xs mb-8 tracking-wide"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Create a profile to save your measurements
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-[0.25em] uppercase transition-all hover:opacity-90"
              style={{ background: "#C8A96E", color: "#1A1814" }}
            >
              <Plus size={13} />
              Create First Profile
            </button>
          </motion.div>
        ) : (
          // ── Profile List ──
          <div className="space-y-3">
            <AnimatePresence>
              {profiles.map((profile, i) => {
                const filled = getFilledCount(profile.measurements);
                const percent = Math.round((filled / 14) * 100);

                return (
                  <motion.div
                    key={profile._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-5 px-6 py-5 group"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: "#C8A96E", color: "#1A1814" }}
                    >
                      {profile.displayName[0].toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white mb-1">
                        {profile.displayName}
                      </p>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-1 h-0.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              background: "#C8A96E",
                            }}
                          />
                        </div>
                        <span
                          className="text-[9px] tracking-wider flex-shrink-0"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          {filled} / 14 filled
                        </span>
                      </div>

                      {/* Preferred fit */}
                      {profile.preferredFit && (
                        <p
                          className="text-[9px] mt-1 tracking-wider"
                          style={{ color: "#C8A96E" }}
                        >
                          {profile.preferredFit} Fit
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Measurements button */}
                      <button
                        onClick={() =>
                          navigate(
                            `/account/profiles/${profile._id}/measurements`
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-2 text-[9px] tracking-wider font-bold transition-all hover:opacity-80"
                        style={{ background: "#C8A96E", color: "#1A1814" }}
                      >
                        <Ruler size={11} />
                        Measurements
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(profile._id)}
                        disabled={deletingId === profile._id}
                        className="w-8 h-8 flex items-center justify-center transition-colors hover:text-red-400 disabled:opacity-30"
                        style={{ color: "rgba(255,255,255,0.25)" }}
                      >
                        <Trash2 size={13} />
                      </button>

                      <ChevronRight
                        size={14}
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Add Profile Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(9,9,14,0.88)", backdropFilter: "blur(10px)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full mx-4 p-8"
              style={{
                maxWidth: "400px",
                background: "#0F0F16",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p
                className="text-[9px] tracking-[0.4em] uppercase mb-2 font-bold"
                style={{ color: "#C8A96E" }}
              >
                New Profile
              </p>
              <h3
                className="text-xl font-bold text-white mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Create a profile
              </h3>

              <label
                className="block text-[9px] tracking-[0.3em] uppercase mb-2 font-bold"
                style={{ color: "#9A9080" }}
              >
                Profile Name
              </label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="e.g. Myself, Brother, Son"
                autoFocus
                className="w-full px-4 py-3 text-xs outline-none mb-6 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#F5F0E8",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgba(200,169,110,0.5)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-white/5"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isCreating || !newProfileName.trim()}
                  className="flex-1 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: "#C8A96E", color: "#1A1814" }}
                >
                  {isCreating ? "Creating..." : "Create Profile"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilesPage;