  import { useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { X, ChevronDown, ChevronUp, Check } from "lucide-react";
  import api from "../../api/axios";

  const CustomizationModal = ({ product, profileId, onClose, onSaved }) => {
    // Build initial selections — default to first option of each group
    const buildInitialSelections = () => {
      const initial = {};
      product.customizationOptions?.forEach((group) => {
        if (group.options?.length > 0) {
          initial[group.groupName] = group.options[0].label;
        }
      });
      return initial;
    };

    const [selections, setSelections] = useState(buildInitialSelections());
    const [openSections, setOpenSections] = useState(() => {
      // Open first section by default
      const open = {};
      product.customizationOptions?.forEach((group, i) => {
        open[group.groupName] = i === 0;
      });
      return open;
    });
    const [isSaving, setIsSaving] = useState(false);

    // Group options by section (Jacket, Trousers etc)
    const groupedBySectionName = product.customizationOptions?.reduce((acc, group) => {
      if (!acc[group.section]) acc[group.section] = [];
      acc[group.section].push(group);
      return acc;
    }, {});

    const toggleSection = (groupName) => {
      setOpenSections((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    const handleSelect = (groupName, optionLabel) => {
      setSelections((prev) => ({ ...prev, [groupName]: optionLabel }));
    };

    const handleSave = async () => {
      setIsSaving(true);
      try {
        const res = await api.post("/api/customizations", {
          productId: product._id,
          profileId,
          selections,
        });
        onSaved(res.data.customization._id);
      } catch (err) {
        console.error("Failed to save customization:", err);
      } finally {
        setIsSaving(false);
      }
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
          className="flex flex-col overflow-hidden"
          style={{
            width: "min(680px, 95vw)",
            maxHeight: "90vh",
            background: "#F5F0E8",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-7 py-5 flex-shrink-0"
            style={{
              background: "#1A1814",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>
              <p
                className="text-[8px] tracking-[0.4em] uppercase font-bold mb-1"
                style={{ color: "#C8A96E" }}
              >
                Customizing
              </p>
              <h3
                className="text-sm font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {product.name}
              </h3>
            </div>

            {/* Save button + close */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 text-xs font-bold tracking-[0.25em] uppercase transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "#C8A96E", color: "#1A1814" }}
              >
                {isSaving ? "Saving..." : "Save Customizations"}
              </button>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Scrollable content ── */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

            {/* Section groups */}
            {groupedBySectionName &&
              Object.entries(groupedBySectionName).map(([sectionName, groups]) => (
                <div key={sectionName}>

                  {/* Section header */}
                  <div
                    className="px-7 py-3"
                    style={{
                      background: "#1A1814",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p
                      className="text-[9px] tracking-[0.35em] uppercase font-bold text-white"
                    >
                      {sectionName}
                    </p>
                  </div>

                  {/* Groups inside section */}
                  {groups.map((group) => {
                    const isOpen = openSections[group.groupName];
                    const selectedOption = group.options?.find(
                      (o) => o.label === selections[group.groupName]
                    );

                    return (
                      <div
                        key={group.groupName}
                        style={{ borderBottom: "1px solid rgba(26,24,20,0.1)" }}
                      >
                        {/* Group toggle row */}
                        <button
                          onClick={() => toggleSection(group.groupName)}
                          className="w-full flex items-center justify-between px-7 py-4 transition-colors hover:bg-white/30"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="text-xs font-semibold"
                              style={{ color: "#1A1814" }}
                            >
                              {group.groupName}:
                            </span>
                            <span
                              className="text-xs font-bold"
                              style={{ color: "#C8A96E" }}
                            >
                              {selections[group.groupName] || "Select"}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp size={14} color="#7A7260" />
                          ) : (
                            <ChevronDown size={14} color="#7A7260" />
                          )}
                        </button>

                        {/* Options panel */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              style={{ overflow: "hidden" }}
                            >
                              <div className="px-7 pb-5">
                                {/* Description */}
                                {selectedOption?.description && (
                                  <p
                                    className="text-[9px] leading-relaxed mb-4"
                                    style={{ color: "#7A7260" }}
                                  >
                                    {selectedOption.description}
                                  </p>
                                )}

                                {/* Options grid */}
                                <div className="flex flex-wrap gap-3">
                                  {group.options?.map((option) => {
                                    const isSelected =
                                      selections[group.groupName] === option.label;
                                    return (
                                      <button
                                        key={option.label}
                                        onClick={() =>
                                          handleSelect(group.groupName, option.label)
                                        }
                                        className="relative flex flex-col items-center gap-2 transition-all"
                                      >
                                        {/* Option image or placeholder */}
                                        <div
                                          className="relative overflow-hidden"
                                          style={{
                                            width: "100px",
                                            height: "80px",
                                            border: isSelected
                                              ? "2px solid #1A1814"
                                              : "2px solid rgba(26,24,20,0.15)",
                                            background: "#EDE8DE",
                                          }}
                                        >
                                          {option.image ? (
                                            <img
                                              src={option.image}
                                              alt={option.label}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                              <span
                                                className="text-[9px] tracking-wider text-center px-2"
                                                style={{ color: "#9A9080" }}
                                              >
                                                {option.label}
                                              </span>
                                            </div>
                                          )}

                                          {/* Selected checkmark */}
                                          {isSelected && (
                                            <div
                                              className="absolute bottom-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                                              style={{ background: "#1A1814" }}
                                            >
                                              <Check size={9} color="#F5F0E8" />
                                            </div>
                                          )}
                                        </div>

                                        {/* Option label */}
                                        <span
                                          className="text-[9px] tracking-wider font-bold"
                                          style={{
                                            color: isSelected ? "#1A1814" : "#7A7260",
                                          }}
                                        >
                                          {option.label}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>

          {/* ── Footer ── */}
          <div
            className="flex items-center justify-between px-7 py-4 flex-shrink-0"
            style={{
              background: "#EDE8DE",
              borderTop: "1px solid rgba(26,24,20,0.1)",
            }}
          >
            <p className="text-[9px] tracking-wider" style={{ color: "#9A9080" }}>
              {Object.keys(selections).length} of{" "}
              {product.customizationOptions?.length || 0} options selected
            </p>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 text-xs font-bold tracking-[0.25em] uppercase transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#1A1814", color: "#F5F0E8" }}
            >
              {isSaving ? "Saving..." : "Save & Add to Cart"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

export default CustomizationModal;