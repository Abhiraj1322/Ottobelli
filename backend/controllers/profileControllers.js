const Profile = require("../models/Profile");
const User = require("../models/User");
 
// @route GET /api/profiles
// @desc  Get all profiles for logged in user
const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.user._id });
    res.status(200).json({ profiles });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route GET /api/profiles/:id
// @desc  Get a single profile by ID
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
 
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
 
    // Make sure profile belongs to logged in user
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this profile" });
    }
 
    res.status(200).json({ profile });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route POST /api/profiles
// @desc  Create a new profile
const createProfile = async (req, res) => {
  try {
    const { displayName } = req.body;
 
    if (!displayName) {
      return res.status(400).json({ message: "Display name is required" });
    }
 
    const profile = await Profile.create({
      userId: req.user._id,
      displayName,
    });
 
    // Add profile ID to user's profiles array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { profiles: profile._id },
    });
 
    res.status(201).json({ profile });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route PUT /api/profiles/:id
// @desc  Update profile display name and details
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
 
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
 
    // Make sure profile belongs to logged in user
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }
 
    const { displayName, preferredFit, fabricsToAvoid, specialInstructions, referencePhotos } =
      req.body;
 
    if (displayName) profile.displayName = displayName;
    if (preferredFit) profile.preferredFit = preferredFit;
    if (fabricsToAvoid) profile.fabricsToAvoid = fabricsToAvoid;
    if (specialInstructions) profile.specialInstructions = specialInstructions;
    if (referencePhotos) profile.referencePhotos = referencePhotos;
 
    const updatedProfile = await profile.save();
    res.status(200).json({ profile: updatedProfile });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route PUT /api/profiles/:id/measurements
// @desc  Save/update measurements for a profile
// Body: { neckCollar: 15.5, chest: 40, ... }
const updateMeasurements = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
 
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
 
    // Make sure profile belongs to logged in user
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }
 
    // Only update fields that were passed in — leave others as they are
    const measurementFields = [
      "neckCollar", "chest", "shoulderWidth", "sleeve",
      "torso", "stomach", "hip", "bicep",
      "wrist", "waist", "legs", "crotch", "thighs", "knees",
    ];
 
    measurementFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile.measurements[field] = req.body[field];
      }
    });
 
    const updatedProfile = await profile.save();
 
    res.status(200).json({
      profile: updatedProfile,
      completionStatus: updatedProfile.completionStatus, // "8/14 filled"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
// @route DELETE /api/profiles/:id
// @desc  Delete a profile
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
 
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
 
    // Make sure profile belongs to logged in user
    if (profile.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this profile" });
    }
 
    await profile.deleteOne();
 
    // Remove profile ID from user's profiles array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { profiles: profile._id },
    });
 
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
 
module.exports = {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  updateMeasurements,
  deleteProfile,
};