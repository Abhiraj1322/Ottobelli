import { useState, useEffect,useRef } from "react";
import { X, ChevronRight, Play, Plus, Users, ShieldAlert, FileText,Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useAuthStore from "../../store/userAuthStore";
import useUploadStore from "../../store/useUploadStore";
import useProfileStore from "../../store/userProfileStore"
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
    <svg viewBox="0 0 120 280" className="w-32 h-60 md:w-[130px] md:h-[240px]" style={{ overflow: "visible" }}>
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
const [fabricsToAvoid, setFabricsToAvoid] = useState("");
const [specialInstructions, setSpecialInstructions] = useState("");
  // Mobile Navigation Tab State ("profiles", "diagram", "form")
  const [mobileTab, setMobileTab] = useState("form");
const {activeProfile, updateProfileDetails,updateMeasurements,switchProfile} = useProfileStore();
// 2. Initialize state using activeProfile (now safely in scope)
  const [displayName, setDisplayName] = useState(activeProfile?.displayName || "");

  // 3. Keep state synced when switching between profiles
  useEffect(() => {
    if (activeProfile?.displayName) {
      setDisplayName(activeProfile.displayName);
    }
  }, [activeProfile]);
  // Fetch profiles from backend
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await api.get("/api/profiles");
        setProfiles(res.data.profiles);
        if (res.data.profiles.length > 0) {
          setActiveProfileId(res.data.profiles[0]._id);
          console.log(activeProfileId)
        }
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);
// Clean up blob URLs when component unmounts or active profile changes
  useEffect(() => {
    return () => {
      Object.values(photos).forEach((photo) => {
        if (photo?.previewUrl) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
    };
  }, [activeProfileId]);
const currentProfile = activeProfile || profiles.find((p) => p._id === activeProfileId) || profiles[0];
  const currentMeasurements = bodyTab === "upper" ? upperBodyMeasurements : lowerBodyMeasurements;
  const activeMeasurementDef = activeMeasurement
    ? allMeasurements.find((m) => m.key === activeMeasurement)
    : null;

  const filledCount = activeProfile
    ? Object.values(activeProfile.measurements || {}).filter((v) => v !== null && v !== undefined).length
    : 0;

  const highlightedBodyParts = activeMeasurement ? highlightedParts[activeMeasurement] ?? [] : [];


  // update measurement///
  const saveEntry = async () => {
  if (!activeMeasurement || !entryValue || !activeProfileId) return;
  setIsSaving(true);

  const numericValue = parseFloat(entryValue);
console.log("1. Saving measurement:", { activeProfileId, activeMeasurement, numericValue })
  try {
    // 1. Call Zustand store action
    // Note: Send { [activeMeasurement]: numericValue } so the backend receives the updated field object
    const result = await updateMeasurements(activeProfileId, {
      [activeMeasurement]: numericValue,
    });
console.log("2. Result from updateMeasurements:", result);
    if (!result.success) {
      console.error("Failed to save:", result.error);
      return;
    }

    // 2. Clear input value for next entry
    setEntryValue("");

    // 3. Navigate to Next Measurement Step
    const idx = allMeasurements.findIndex((m) => m.key === activeMeasurement);

    if (idx < allMeasurements.length - 1) {
      // Move to next measurement key
      setActiveMeasurement(allMeasurements[idx + 1].key);
    } else {
      // Reached the last measurement in the sequence
      setActiveMeasurement(null);
    }
  } catch (err) {
    console.error("Failed to save measurement:", err);
  } finally {
    setIsSaving(false);
  }
};

// Submit profile details & photos
  const handleSaveProfile = async () => {
    if (!activeProfile?._id) return;

    setIsSaving(true);

    try {
      // 1. Separate existing image URLs from newly selected files
      const existingUrls = photos.filter((p) => p.isExisting).map((p) => p.serverUrl);
      const newFiles = photos.filter((p) => !p.isExisting && p.file).map((p) => p.file);

      let newlyUploadedUrls = [];

      // 2. Optional: If you have a backend endpoint to upload raw files, execute it here
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((file) => formData.append("images", file));

        /* Example upload request if handling multipart backend upload:
        const uploadRes = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newlyUploadedUrls = uploadRes.data.urls; 
        */

        // Direct preview fallback if uploading via base64 or external pipeline:
        newlyUploadedUrls = newFiles.map((file) => URL.createObjectURL(file));
      }

      // 3. Combine existing URLs and newly uploaded URLs
      const finalReferencePhotos = [...existingUrls, ...newlyUploadedUrls];

      // 4. Format fabrics to avoid into array
      const fabricsArray = fabricsToAvoid
        ? fabricsToAvoid.split(",").map((item) => item.trim()).filter(Boolean)
        : [];

      // 5. Send updated details to Zustand action
      const result = await updateProfileDetails(activeProfile._id, {
        displayName,
        fabricsToAvoid: fabricsArray,
        specialInstructions,
        referencePhotos: finalReferencePhotos,
      });

      if (result.success) {
        alert("Profile details saved successfully!");
      } else {
        alert(result.error || "Failed to save profile details");
      }
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setIsSaving(false);
    }
  };



// -------------------------------------------------------------
 const fileInputRef = useRef(null);
  
  // Local state for instant image preview items
  const [photos, setPhotos] = useState([]);

  // Zustand state and upload action
  const { uploadPhotos, loading, error } = useUploadStore();

  // Cleanup object URLs to avoid browser memory leaks when component unmounts
  useEffect(() => {
    return () => {
      photos.forEach((photo) => {
        if (photo.previewUrl) URL.revokeObjectURL(photo.previewUrl);
      });
    };
  }, [photos]);

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const fileArray = Array.from(selectedFiles);

    // 1. Create immediate local preview objects
    const newPhotos = fileArray.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      serverUrl: null,
    }));

    // Append to UI grid immediately
    setPhotos((prev) => [...prev, ...newPhotos]);

    // 2. Upload to Express backend via Zustand store
    const uploadedUrls = await uploadPhotos(fileArray);

    if (uploadedUrls) {
      // 3. Attach backend URLs to local items once finished
      setPhotos((prev) =>
        prev.map((photo) => {
          const matchingIndex = fileArray.indexOf(photo.file);
          if (matchingIndex !== -1 && uploadedUrls[matchingIndex]) {
            return { ...photo, serverUrl: uploadedUrls[matchingIndex] };
          }
          return photo;
        })
      );
    }

    // Clear input value so selecting the same file again triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePhoto = (idToRemove) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === idToRemove);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl); // Revoke memory
      }
      return prev.filter((p) => p.id !== idToRemove);
    });
  };
  
  // Add new profile
const handleAddProfile = async () => {
  const name = prompt("Enter profile name (e.g. Brother, Son):");
  if (!name) return;

  try {
    const res = await api.post("/api/profiles", { displayName: name });
    const newProfile = res.data.profile;

    // 1. Add new profile to Zustand store & set it active
    useProfileStore.setState((state) => ({
      profiles: [...state.profiles, newProfile],
      activeProfile: newProfile, // 👈 Makes this the active profile immediately
    }));

    // 2. Set active profile ID for UI highlighting
    setActiveProfileId(newProfile._id);
    setMobileTab("form");
  } catch (err) {
    console.error("Failed to create profile:", err);
  }
};
  

  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#09090E]">
        <p className="text-white/40 text-sm tracking-widest">Loading...</p>
      </div>
    );
  }
  console.log("🔥 Component Rendered! activeProfile is:", activeProfile);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#09090E] p-0 md:p-4 md:pt-16">
      {/* Container wrapper: Stacks on mobile, Grid on desktop */}
      <div
        className="w-full md:w-[95vw] lg:w-[900px] h-screen md:h-[90vh] md:max-h-[680px] bg-[#F5F0E8] flex flex-col md:grid md:grid-cols-[180px_260px_1fr] overflow-hidden"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {/* ── Mobile Tab Navigation Header (Visible only on mobile) ── */}
        <div className="flex md:hidden bg-[#1A1814] text-[#7A7260] justify-around items-center border-b border-white/5 py-2 z-10">
          <button
            onClick={() => setMobileTab("profiles")}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] uppercase font-bold tracking-wider transition-colors ${
              mobileTab === "profiles" ? "text-[#C8A96E]" : ""
            }`}
          >
            <Users size={16} />
            <span>Profiles</span>
          </button>
          <button
            onClick={() => setMobileTab("diagram")}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] uppercase font-bold tracking-wider transition-colors ${
              mobileTab === "diagram" ? "text-[#C8A96E]" : ""
            }`}
          >
            <ShieldAlert size={16} />
            <span>Visual</span>
          </button>
          <button
            onClick={() => setMobileTab("form")}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] uppercase font-bold tracking-wider transition-colors ${
              mobileTab === "form" ? "text-[#C8A96E]" : ""
            }`}
          >
            <FileText size={16} />
            <span>Entry</span>
          </button>
        </div>

   {/* ── Left — Profile list (Responsive visibility) ── */}
<div
  className={`flex-col overflow-hidden flex-shrink-0 w-full md:w-[180px] md:flex ${
    mobileTab === "profiles" ? "flex h-full" : "hidden"
  }`}
  style={{
    maxWidth: "none",
    background: "#FFFFFF",
    borderRight: "1px solid rgba(26,24,20,0.08)",
  }}
>
  <div className="px-4 py-4 border-b border-black/5 flex-shrink-0">
    <p className="text-[9px] tracking-[0.35em] uppercase font-bold text-[#9A9080]">
      Profiles
    </p>
  </div>

  <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
    {profiles.map((profile) => {
      // Safely extract string IDs to guarantee matching regardless of key type (_id vs id)
      const currentProfileId = String(profile._id || profile.id);
      const activeId = String(
        activeProfile?._id || activeProfile?.id || activeProfileId || ""
      );

      const isActive = currentProfileId === activeId;

      return (
        <button
          key={profile._id || profile.id}
          onClick={() => {
            const selectedId = profile._id || profile.id;
            switchProfile(selectedId);
            if (typeof setActiveProfileId === "function") {
              setActiveProfileId(selectedId);
            }
            setMobileTab("form"); // Auto navigate to form view on mobile upon selection
          }}
          className="w-full text-left px-4 py-3.5 border-b border-black/[0.06] transition-colors"
          style={{
            background: isActive ? "#F5F0E8" : "transparent",
          }}
        >
          <p className="text-xs font-semibold text-[#1A1814]">
            {profile.displayName}
          </p>
          <p className="text-[9px] mt-0.5 text-[#9A9080]">
            {Object.values(profile.measurements || {}).filter(
              (v) => v !== null && v !== undefined
            ).length} / 14 filled
          </p>
        </button>
      );
    })}

    <button
      onClick={handleAddProfile}
      className="w-full px-4 py-3 flex items-center gap-1.5 text-[10px] tracking-wider hover:bg-[#F5F0E8] transition-colors text-[#C8A96E] font-semibold"
    >
      <Plus size={11} />
      Add Profile
    </button>
  </div>
</div>

        {/* ── Center — Body diagram (Responsive visibility) ── */}
        <div
          className={`flex-col items-center justify-between flex-shrink-0 relative md:flex bg-[#F5F0E8] ${
            mobileTab === "diagram" ? "flex h-full" : "hidden"
          }`}
          style={{
            width: "100%",
            borderRight: "1px solid rgba(26,24,20,0.08)",
          }}
        
        >
          {/* Body tab toggle */}
          <div className="w-full flex border-b border-black/5">
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
            <p className="text-[9px] tracking-wider text-[#9A9080]">
              {filledCount} / 14
            </p>
          </div>
        </div>

        {/* ── Right — Measurement form (Responsive visibility) ── */}
        <div className={`flex-col flex-1 overflow-hidden md:flex ${
          mobileTab === "form" ? "flex h-full" : "hidden"
        }`}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-black/5 bg-white">
            <div>
              <h3 className="text-sm font-bold text-[#1A1814]">
                {activeProfile?.displayName ?? "Select a profile"}
              </h3>
              <p className="text-[9px] mt-0.5 text-[#9A9080]">
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
                className="border-b border-black/5 flex-shrink-0 overflow-hidden bg-white"
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <div>
                      <h4 className="text-base font-bold text-[#1A1814]">
                        {activeMeasurementDef.label}
                      </h4>
                      <p className="text-[9px] mt-0.5 leading-relaxed max-w-xs text-[#7A7260]">
                        {activeMeasurementDef.hint}
                      </p>
                    </div>
                    <span className="text-5xl font-bold opacity-10 leading-none text-[#1A1814]">
                      {(allMeasurements.indexOf(activeMeasurementDef) + 1).toString().padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center border border-black/20">
                      <input
                        type="number"
                        value={entryValue}
                        onChange={(e) => setEntryValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEntry()}
                        placeholder="0.0"
                        className="w-20 px-3 py-2 text-center text-lg font-bold outline-none bg-transparent text-[#1A1814]"
                        autoFocus
                      />
                      <span className="pr-3 text-sm text-[#9A9080]">in</span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
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
                        className="px-3 py-2 text-[9px] border border-black/15 text-[#7A7260] transition-colors hover:bg-[#F5F0E8] tracking-wider"
                      >
                        ← Prev
                      </button>
                      <button
                        onClick={saveEntry}
                        disabled={isSaving}
                        className="px-3 py-2 text-[9px] border border-black/15 text-[#7A7260] transition-colors hover:bg-[#F5F0E8] tracking-wider"
                      >
                        {isSaving ? "..." : "Next →"}
                      </button>
                      <button
                        className="px-3 py-2 text-[9px] tracking-wider flex items-center gap-1 transition-colors hover:opacity-80 bg-[#C8A96E] text-[#1A1814] font-bold"
                      >
                        <Play size={9} fill="#1A1814" />
                        Guide
                      </button>
                      <button
                        onClick={() => { setActiveMeasurement(null); setEntryValue(""); }}
                        className="w-8 h-8 flex items-center justify-center border border-black/15 text-[#7A7260] transition-colors hover:bg-[#F5F0E8]"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[8px] tracking-[0.3em] uppercase mt-2 text-[#C8A96E] font-600">
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
          <div className="flex-1 overflow-y-auto pb-8" style={{ scrollbarWidth: "none" }}>
            <div className="px-6 py-2 border-b border-black/5 bg-[#EDE8DE]">
              <p className="text-[8px] tracking-[0.4em] uppercase font-bold text-[#7A7260]">
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
                  className="w-full flex items-center px-6 py-3 border-b border-black/[0.07] transition-colors hover:bg-white/50"
                  style={{
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
                  <div className="flex-1 text-left flex items-center justify-between pr-2">
                    <span className="text-xs font-semibold text-[#1A1814]">
                      <span className="mr-1.5 text-[10px] text-[#9A9080]">{i + 1}</span>
                      {measurement.label}
                    </span>
                    {value ? (
                      <span className="text-[10px] font-bold text-[#C8A96E]">
                        {value} in
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#9A9080]">Tap to enter</span>
                    )}
                  </div>
                  <ChevronRight size={12} color="#9A9080" />
                </button>
              );
            })}

            {/* Profile details accordion */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between px-6 py-3 border-b border-black/5 bg-[#EDE8DE]"
            >
              <p className="text-[8px] tracking-[0.4em] uppercase font-bold text-[#7A7260]">
                Profile Details
              </p>
              <span className="text-[10px] text-[#9A9080]">{showDetails ? "▲" : "▼"}</span>
            </button>

            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-5 space-y-4">
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-bold text-[#9A9080]">
                        Display Name
                      </p>
                      <input
                        className="w-full px-3 py-2 text-xs border border-black/15 text-[#1A1814] bg-white outline-none"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
       
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-bold text-[#9A9080]">
                        Fabrics to Avoid
                      </p>
                      <select
                        className="w-full px-3 py-2 text-xs border border-black/15 text-[#7A7260] bg-white outline-none"
                      >
                        <option>Add fabric to avoid...</option>
                        <option>Polyester</option>
                        <option>Synthetic blends</option>
                        <option>Mohair</option>
                      </select>
                    </div>
                   <div>
      <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-bold text-[#9A9080]">
        Reference Photos
      </p>

      {/* Hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        multiple
        className="hidden"
      />

      {/* Photo Grid & Upload Trigger */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Thumbnail Preview Items */}
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative w-24 h-20 border border-black/10 rounded-sm overflow-hidden group bg-[#EDE8DE]"
          >
            <img
              src={photo.previewUrl}
              alt="Reference preview"
              className="w-full h-full object-cover"
            />
            
            {/* Delete button overlay */}
            <button
              type="button"
              onClick={() => handleRemovePhoto(photo.id)}
              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove photo"
            >
              <X size={10} />
            </button>
          </div>
        ))}

        {/* Add Photo Button (Triggers File Picker) */}
        <button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-20 border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-1 transition-colors hover:bg-[#EDE8DE] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin text-[#9A9080]" />
          ) : (
            <>
              <Plus size={14} color="#9A9080" />
              <span className="text-[9px] tracking-wider text-[#9A9080]">
                ADD PHOTO
              </span>
            </>
          )}
        </button>
      </div>

      {/* Display Zustand Upload Errors */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase mb-1.5 font-bold text-[#9A9080]">
                        Special Instructions
                      </p>
                      <textarea
                        className="w-full px-3 py-2 text-xs border border-black/15 text-[#7A7260] bg-white outline-none resize-none"
                        rows={3}
                        placeholder="Specific requests, posture notes, fitting preferences..."
                        defaultValue={activeProfile?.specialInstructions ?? ""}
                      />
                    </div>
                      {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving || loading}
              className="px-5 py-2.5 bg-[#1A1814] hover:bg-[#33302B] text-[#EDE8DE] text-[10px] font-bold tracking-[0.25em] uppercase transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  SAVING...
                </>
              ) : (
                "SAVE PROFILE"
              )}
            </button>
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