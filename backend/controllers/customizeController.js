const CustomizationSelection = require("../models/Customizationselection");

// @route POST /api/customizations
// @desc  Save a customization selection for a product
// Body: { productId, profileId, selections: { "Shoulder Type": "Standard", "Lapels": "Notch" } }
const createCustomization = async (req, res) => {
  try {
    const { productId, profileId, selections } = req.body;

    if (!productId || !selections) {
      return res.status(400).json({ message: "productId, profileId and selections are required" });
    }

    const customization = await CustomizationSelection.create({
      userId: req.user._id,
      productId,
      selections,
    });

    res.status(201).json({ customization });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route GET /api/customizations/:id
// @desc  Get a single customization selection by ID
const getCustomization = async (req, res) => {
  try {
    const customization = await CustomizationSelection.findById(req.params.id)
      .populate("productId", "name slug customizationOptions")
      .populate("profileId", "displayName");

    if (!customization) {
      return res.status(404).json({ message: "Customization not found" });
    }

    // Make sure customization belongs to logged in user
    if (customization.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json({ customization });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route PUT /api/customizations/:id
// @desc  Update a customization selection
const updateCustomization = async (req, res) => {
  try {
    const customization = await CustomizationSelection.findById(req.params.id);

    if (!customization) {
      return res.status(404).json({ message: "Customization not found" });
    }

    // Make sure customization belongs to logged in user
    if (customization.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { selections } = req.body;
    if (selections) customization.selections = selections;

    const updated = await customization.save();
    res.status(200).json({ customization: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createCustomization, getCustomization, updateCustomization };