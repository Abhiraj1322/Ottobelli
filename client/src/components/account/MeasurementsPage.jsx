import { useState, useEffect } from "react";
import { X, ChevronRight, Play, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/userAuthStore";

// ─── Measurement definitions ──────────────────────────────────────────────
const upperBodyMeasurements = [
  { key: "neckCollar", label: "Neck / Collar", hint: "Just below the Adam's apple, two fingers between tape. Follow the neck's curvature." },
  { key: "chest", label: "Chest", hint: "Measure around the fullest part of the chest, keeping the tape parallel to the floor." },
  { key: "shoulderWidth", label: "Shoulder Width", hint: "From the edge of one shoulder to the other, across the back." },
  { key: "sleeve", label: "Sleeve", hint: "From the shoulder seam down to the wrist bone with arm slightly bent." },
  { key: "torso", label: "Torso", hint: "From the top of the shoulder down to the natural waistline." },
  { key: "stomach", label: "Stomach", hint: "Around the fullest part of the stomach, usually 1-2 inches below the navel." },
  { key: "hip", label: "Hip", hint: "Around the fullest part of the hips, about 7-9 inches below the natural waist." },
  { key: "bicep", label: "Bicep", hint: "Around the fullest part of the upper arm with arm relaxed at your side." },
  { key: "wrist", label: "Wrist", hint: "Around the wrist bone. Keep one finger under the tape for comfort." },
];

const lowerBodyMeasurements = [
  { key: "waist", label: "Waist", hint: "Around the natural waistline, the narrowest part of the torso." },
  { key: "legs", label: "Legs", hint: "From the crotch seam down to the ankle bone." },
  { key: "crotch", label: "Crotch", hint: "From the natural waist down through the legs to the crotch seam." },
  { key: "thighs", label: "Thighs", hint: "Around the fullest part of the upper thigh." },
  { key: "knees", label: "Knees", hint: "Around the knee with leg slightly bent." },
];

const allMeasurements = [...upperBodyMeasurements, ...lowerBodyMeasurements];

// ─── Highlighted body parts map ───────────────────────────────────────────
const highlightedParts = {
  neckCollar: ["neck"],
  chest: ["chest"],
  shoulderWidth: ["shoulders"],
  sleeve: ["leftArm", "rightArm"],
  torso: ["torso"],
  stomach: ["stomach"],
  hip: ["hips"],
  bicep: ["leftArm", "rightArm"],
  wrist: ["leftWrist", "rightWrist"],
  waist: ["waist"],
  legs: ["leftLeg", "rightLeg"],
  crotch: ["crotch"],
  thighs: ["leftThigh", "rightThigh"],
  knees: ["leftKnee", "rightKnee"],
};

// ─── Body Diagram SVG ─────────────────────────────────────────────────────
const BodyDiagram = ({ highlighted = [] }) => {
  const isHighlighted = (part) => highlighted.includes(part);
  const h = (part) => ({
    fill: isHighlighted(part) ? "#C8A96E" : "#D4CCBC",
    stroke: isHighlighted(part) ? "#C8A96E" : "#B0A890",
    opacity: isHighlighted(part) ? 0.8 : 0.5,
    transition: "all 0.3s ease",
  });

  return (
    <svg viewBox="0 0 120 280" width="130" height="240" style={{ overflow: "visible" }}>
      <ellipse cx="60" cy="22" rx="14" ry="16" {...h("neck")} strokeWidth="1.5" />
      <rect x="55" y="36" width="10" height="10" rx="2" {...h("neck")} strokeWidth="1" />
      <path d="M26 54 Q20 50 16 56 Q14 62 20 68 L26 70" fill="none" stroke={isHighlighted("shoulders") ? "#C8A96E" : "#B0A890"} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: isHighlighted("shoulders") ? 0.9 : 0.5, transition: "all 0.3s" }} />
      <path d="M94 54 Q100 50 104 56 Q106 62 100 68 L94 70" fill="none" stroke={isHighlighted("shoulders") ? "#C8A96E" : "#B0A890"} strokeWidth="1.5" strokeLinecap="round" style={{ opacity: isHighlighted("shoulders") ? 0.9 : 0.5, transition: "all 0.3s" }} />
      <path d="M26 46 Q35 42 60 42 Q85 42 94 46 L98 90 Q85 96 60 96 Q35 96 22 90 Z" {...h("chest")} strokeWidth="1.5" />
      <rect x="30" y="90" width="60" height="26" rx="4" {...h("stomach")} strokeWidth="1" />
      <path d="M28 116 Q22 118 20 128 Q20 140 30 140 L42 138 L78 138 L90 140 Q100 140 100 128 Q98 118 92 116 Z" {...h("hips")} strokeWidth="1.5" />
      <path d="M26 46 L16 58 L14 88 L22 90 L28 70 Z" {...h("leftArm")} strokeWidth="1" />
      <path d="M94 46 L104 58 L106 88 L98 90 L92 70 Z" {...h("rightArm")} strokeWidth="1" />
      <path d="M14 88 L10 118 L16 120 L22 90 Z" {...h("leftWrist")} strokeWidth="1" />
      <path d="M106 88 L110 118 L104 120 L98 90 Z" {...h("rightWrist")} strokeWidth="1" />
      <ellipse cx="13" cy="124" rx="5" ry="8" {...h("leftWrist")} strokeWidth="1" />
      <ellipse cx="107" cy="124" rx="5" ry="8" {...h("rightWrist")} strokeWidth="1" />
      {isHighlighted("waist") && <line x1="22" y1="112" x2="98" y2="112" stroke="#C8A96E" strokeWidth="2" strokeDasharray="3,3" style={{ opacity: 0.8 }} />}
      <path d="M30 140 L26 190 L42 192 L44 138 Z" {...h("leftThigh")} strokeWidth="1" />
      <path d="M90 140 L94 190 L78 192 L76 138 Z" {...h("rightThigh")} strokeWidth="1" />
      <ellipse cx="34" cy="194" rx="9" ry="7" {...h("leftKnee")} strokeWidth="1" />
      <ellipse cx="86" cy="194" rx="9" ry="7" {...h("rightKnee")} strokeWidth="1" />
      <path d="M26 198 L24 248 L38 250 L42 200 Z" {...h("leftLeg")} strokeWidth="1" />
      <path d="M94 198 L96 248 L82 250 L78 200 Z" {...h("rightLeg")} strokeWidth="1" />
      <ellipse cx="31" cy="253" rx="8" ry="5" {...h("leftLeg")} strokeWidth="1" />
      <ellipse cx="89" cy="253" rx="8" ry="5" {...h("rightLeg")} strokeWidth="1" />
      {isHighlighted("crotch") && <circle cx="60" cy="138" r="6" fill="none" stroke="#C8A96E" strokeWidth="1.5" style={{ opacity: 0.8 }} />}
    </svg>
  );
};

// ─── Main Measurements Page ───────────────────────────────────────────────
const MeasurementsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [bodyTab, setBodyTab] = useState("upper");
  const [activeMeasurement, setActiveMeasurement] = useState(null);
  const [entryValue, setEntryValue] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch profiles from backend
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get("/api/profiles");
        setProfiles(res.data.profiles);
        if (res.data.profiles.length > 0) {
          setActiveProfileId(res.data.profiles[0]._id);
        }
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const activeProfile = profiles.find((p) => p._id === activeProfileId) ?? profiles[0];
  const currentMeasurements = bodyTab === "upper" ? upperBodyMeasurements : lowerBodyMeasurements;
  const activeMeasurementDef = activeMeasurement
    ? allMeasurements.find((m) => m.key === activeMeasurement)
    : null;

  const filledCount = activeProfile
    ? Object.values(activeProfile.measurements || {}).filter((v) => v !== null && v !== undefined).length
    : 0;

  const highlightedBodyParts = activeMeasurement ? highlightedParts[activeMeasurement] ?? [] : [];

  // Save measurement to backend
  const saveEntry = async () => {
    if (!activeMeasurement || !entryValue || !activeProfileId) return;
    setIsSaving(true);
    try {
      await api.put(`/api/profiles/${activeProfileId}/measurements`, {
        [activeMeasurement]: parseFloat(entryValue),
      });

      // Update local state
      setProfiles((prev) =>
        prev.map((p) =>
          p._id === activeProfileId
            ? {
                ...p,
                measurements: {
                  ...p.measurements,
                  [activeMeasurement]: parseFloat(entryValue),
                },
              }
            : p
        )
      );

      // Move to next measurement
      const idx = allMeasurements.findIndex((m) => m.key === activeMeasurement);
      if (idx < allMeasurements.length - 1) {
        setActiveMeasurement(allMeasurements[idx + 1].key);
        setEntryValue("");
      } else {
        setActiveMeasurement(null);
        setEntryValue("");
      }
    } catch (err) {
      console.error("Failed to save measurement:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add new profile
  const handleAddProfile = async () => {
    const name = prompt("Enter profile name (e.g. Brother, Son):");
    if (!name) return;
    try {
      const res = await api.post("/api/profiles", { displayName: name });
      setProfiles((prev) => [...prev, res.data.profile]);
      setActiveProfileId(res.data.profile._id);
    } catch (err) {
      console.error("Failed to create profile:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "#09090E" }}>
        <p className="text-white/40 text-sm tracking-widest">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "#09090E", paddingTop: "46px" }}
    >
      <div
        className="flex overflow-hidden"
        style={{
          width: "min(900px, 95vw)",
          height: "min(680px, 90vh)",
          background: "#F5F0E8",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {/* ── Left — Profile list ── */}
        <div
          className="flex flex-col overflow-hidden flex-shrink-0"
          style={{ width: "180px", background: "#FFFFFF", borderRight: "1px solid rgba(26,24,20,0.08)" }}
        >
          <div className="px-4 py-4 border-b" style={{ borderColor: "rgba(26,24,20,0.08)" }}>
            <p className="text-[9px] tracking-[0.35em] uppercase font-bold" style={{ color: "#9A9080" }}>
              Profiles
            </p>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {profiles.map((profile) => (
              <button
                key={profile._id}
                onClick={() => setActiveProfileId(profile._id)}
                className="w-full text-left px-4 py-3.5 border-b transition-colors"
                style={{
                  borderColor: "rgba(26,24,20,0.06)",
                  background: profile._id === activeProfileId ? "#F5F0E8" : "transparent",
                }}
              >
                <p className="text-xs font-semibold" style={{ color: "#1A1814" }}>
                  {profile.displayName}
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: "#9A9080" }}>
                  {Object.values(profile.measurements || {}).filter((v) => v !== null && v !== undefined).length} / 14 filled
                </p>
              </button>
            ))}

            <button
              onClick={handleAddProfile}
              className="w-full px-4 py-3 flex items-center gap-1.5 text-[10px] tracking-wider hover:bg-[#F5F0E8] transition-colors"
              style={{ color: "#C8A96E", fontWeight: 600 }}
            >
              <Plus size={11} />
              Add Profile
            </button>
          </div>
        </div>

        {/* ── Center — Body diagram ── */}
        <div
          className="flex flex-col items-center justify-between flex-shrink-0 relative"
          style={{ width: "260px", background: "#F5F0E8", borderRight: "1px solid rgba(26,24,20,0.08)" }}
        >
          {/* Body tab toggle */}
          <div className="w-full flex border-b" style={{ borderColor: "rgba(26,24,20,0.08)" }}>
            {["upper", "lower"].map((tab) => (
              <button
                key={tab}
                onClick={() => setBodyTab(tab)}
                className="flex-1 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase transition-colors"
                style={{
                  background: bodyTab === tab ? "#1A1814" : "transparent",
                  color: bodyTab === tab ? "#F5F0E8" : "#7A7260",
                }}
              >
                {tab === "upper" ? "Upper Body" : "Lower Body"}
              </button>
            ))}
          </div>

          {/* SVG body diagram */}
          <div className="flex-1 flex items-center justify-center p-6">
            <BodyDiagram highlighted={highlightedBodyParts} />
          </div>

          {/* Progress dots */}
          <div className="pb-5 flex flex-col items-center gap-1.5">
            <div className="flex gap-1 flex-wrap justify-center px-4">
              {allMeasurements.map((m) => (
                <div
                  key={m.key}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background:
                      activeProfile?.measurements?.[m.key] !== null &&
                      activeProfile?.measurements?.[m.key] !== undefined
                        ? "#C8A96E"
                        : "rgba(26,24,20,0.15)",
                  }}
                />
              ))}
            </div>
            <p className="text-[9px] tracking-wider" style={{ color: "#9A9080" }}>
              {filledCount} / 14
            </p>
          </div>
        </div>

        {/* ── Right — Measurement form ── */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b"
            style={{ borderColor: "rgba(26,24,20,0.08)", background: "#FFFFFF" }}
          >
            <div>
              <h3 className="text-sm font-bold" style={{ color: "#1A1814" }}>
                {activeProfile?.displayName ?? "Select a profile"}
              </h3>
              <p className="text-[9px] mt-0.5" style={{ color: "#9A9080" }}>
                Select a measurement to begin
              </p>
            </div>
            <button
              onClick={() => navigate("/account")}
              className="text-[#9A9080] hover:text-[#1A1814] transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Entry panel — shows when measurement is selected */}
          <AnimatePresence>
            {activeMeasurementDef && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b flex-shrink-0 overflow-hidden"
                style={{ borderColor: "rgba(26,24,20,0.08)", background: "#FFFFFF" }}
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-base font-bold" style={{ color: "#1A1814" }}>
                        {activeMeasurementDef.label}
                      </h4>
                      <p className="text-[9px] mt-0.5 leading-relaxed max-w-xs" style={{ color: "#7A7260" }}>
                        {activeMeasurementDef.hint}
                      </p>
                    </div>
                    <span className="text-5xl font-bold opacity-10 leading-none" style={{ color: "#1A1814" }}>
                      {(allMeasurements.indexOf(activeMeasurementDef) + 1).toString().padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border" style={{ borderColor: "rgba(26,24,20,0.2)" }}>
                      <input
                        type="number"
                        value={entryValue}
                        onChange={(e) => setEntryValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEntry()}
                        placeholder="0.0"
                        className="w-20 px-3 py-2 text-center text-lg font-bold outline-none bg-transparent"
                        style={{ color: "#1A1814" }}
                        autoFocus
                      />
                      <span className="pr-3 text-sm" style={{ color: "#9A9080" }}>in</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const idx = allMeasurements.indexOf(activeMeasurementDef);
                          if (idx > 0) {
                            setActiveMeasurement(allMeasurements[idx - 1].key);
                            setEntryValue(
                              activeProfile?.measurements?.[allMeasurements[idx - 1].key]?.toString() ?? ""
                            );
                          }
                        }}
                        className="px-3 py-2 text-[9px] border transition-colors hover:bg-[#F5F0E8] tracking-wider"
                        style={{ borderColor: "rgba(26,24,20,0.15)", color: "#7A7260" }}
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={saveEntry}
                        disabled={isSaving}
                        className="px-3 py-2 text-[9px] border transition-colors hover:bg-[#F5F0E8] tracking-wider"
                        style={{ borderColor: "rgba(26,24,20,0.15)", color: "#7A7260" }}
                      >
                        {isSaving ? "..." : "Next →"}
                      </button>
                      <button
                        className="px-3 py-2 text-[9px] tracking-wider flex items-center gap-1 transition-colors hover:opacity-80"
                        style={{ background: "#C8A96E", color: "#1A1814", fontWeight: 700 }}
                      >
                        <Play size={9} fill="#1A1814" />
                        Guide
                      </button>
                      <button
                        onClick={() => { setActiveMeasurement(null); setEntryValue(""); }}
                        className="w-8 h-8 flex items-center justify-center border transition-colors hover:bg-[#F5F0E8]"
                        style={{ borderColor: "rgba(26,24,20,0.15)", color: "#7A7260" }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[8px] tracking-[0.3em] uppercase mt-2" style={{ color: "#C8A96E", fontWeight: 600 }}>
                    {activeProfile?.measurements?.[activeMeasurementDef.key] !== null &&
                    activeProfile?.measurements?.[activeMeasurementDef.key] !== undefined
                      ? "✓ Measurement saved"
                      : "· Awaiting measurement"}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Measurement list */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div
              className="px-6 py-2 border-b"
              style={{ background: "#EDE8DE", borderColor: "rgba(26,24,20,0.08)" }}
            >
              <p className="text-[8px] tracking-[0.4em] uppercase font-bold" style={{ color: "#7A7260" }}>
                {bodyTab === "upper" ? "Upper Body" : "Lower Body"}
              </p>
            </div>

            {currentMeasurements.map((measurement, i) => {
              const value = activeProfile?.measurements?.[measurement.key];
              const isActive = activeMeasurement === measurement.key;
              return (
                <button
                  key={measurement.key}
                  onClick={() => {
                    setActiveMeasurement(measurement.key);
                    setEntryValue(value?.toString() ?? "");
                  }}
                  className="w-full flex items-center px-6 py-3 border-b transition-colors hover:bg-white/50"
                  style={{
                    borderColor: "rgba(26,24,20,0.07)",
                    background: isActive ? "#FFFFFF" : "transparent",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-3"
                    style={{
                      borderColor: value ? "#C8A96E" : "rgba(26,24,20,0.2)",
                      background: value ? "#C8A96E" : "transparent",
                    }}
                  >
                    {value && <span style={{ color: "#1A1814", fontSize: "8px", fontWeight: 700 }}>✓</span>}
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-xs font-semibold" style={{ color: "#1A1814" }}>
                      <span className="mr-1.5 text-[10px]" style={{ color: "#9A9080" }}>{i + 1}</span>
                      {measurement.label}
                    </span>
                    {value ? (
                      <span className="ml-2 text-[10px] font-bold" style={{ color: "#C8A96E" }}>
                        {value} in
                      </span>
                    ) : (
                      <span className="ml-2 text-[9px]" style={{ color: "#9A9080" }}>Tap to enter</span>
                    )}
                  </div>
                  <ChevronRight size={12} color="#9A9080" />
                </button>
              );
            })}

            {/* Profile details accordion */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-6 py-3 border-b"
              style={{ borderColor: "rgba(26,24,20,0.07)", background: "#EDE8DE" }}
            >
              <p className="text-[8px] tracking-[0.4em] uppercase font-bold" style={{ color: "#7A7260" }}>
                Profile Details
              </p>
              <span className="text-[10px]" style={{ color: "#9A9080" }}>{showDetails ? "▲" : "▼"}</span>
            </button>

            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="px-6 py-5 space-y-4">
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-bold" style={{ color: "#9A9080" }}>
                        Display Name
                      </p>
                      <input
                        className="w-full px-3 py-2 text-xs border outline-none"
                        style={{ borderColor: "rgba(26,24,20,0.15)", color: "#1A1814", background: "#FFFFFF" }}
                        defaultValue={activeProfile?.displayName}
                      />
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-bold" style={{ color: "#9A9080" }}>
                        Preferred Fit
                      </p>
                      <select
                        className="w-full px-3 py-2 text-xs border outline-none"
                        style={{ borderColor: "rgba(26,24,20,0.15)", color: "#7A7260", background: "#FFFFFF" }}
                        defaultValue={activeProfile?.preferredFit ?? ""}
                      >
                        <option value="">Select fit...</option>
                        <option value="Slim">Slim</option>
                        <option value="Regular">Regular</option>
                        <option value="Relaxed">Relaxed</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-bold" style={{ color: "#9A9080" }}>
                        Fabrics to Avoid
                      </p>
                      <select
                        className="w-full px-3 py-2 text-xs border outline-none"
                        style={{ borderColor: "rgba(26,24,20,0.15)", color: "#7A7260", background: "#FFFFFF" }}
                      >
                        <option>Add fabric to avoid...</option>
                        <option>Polyester</option>
                        <option>Synthetic blends</option>
                        <option>Mohair</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-bold" style={{ color: "#9A9080" }}>
                        Reference Photos
                      </p>
                      <button
                        className="w-24 h-20 border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors hover:bg-[#EDE8DE]"
                        style={{ borderColor: "rgba(26,24,20,0.15)" }}
                      >
                        <Plus size={14} color="#9A9080" />
                        <span className="text-[9px] tracking-wider" style={{ color: "#9A9080" }}>ADD PHOTO</span>
                      </button>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-bold" style={{ color: "#9A9080" }}>
                        Special Instructions
                      </p>
                      <textarea
                        className="w-full px-3 py-2 text-xs border outline-none resize-none"
                        rows={3}
                        placeholder="Specific requests, posture notes, fitting preferences..."
                        style={{ borderColor: "rgba(26,24,20,0.15)", color: "#7A7260", background: "#FFFFFF" }}
                        defaultValue={activeProfile?.specialInstructions ?? ""}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsPage;