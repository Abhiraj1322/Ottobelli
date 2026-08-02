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
    const userId = req.user._id; // Extracted from Auth middleware
    const { displayName, measurements, preferredFit, fabricsToAvoid, specialInstructions } = req.body;

    // 1. Create the Profile document
    const newProfile = await Profile.create({
      userId,
      displayName,
      measurements,
      preferredFit,
      fabricsToAvoid,
      specialInstructions,
    });

    // 2. Add profile to user's array & set as active if no active profile exists
    const user = await User.findById(userId);
    user.profiles.push(newProfile._id);

    if (!user.activeProfileId) {
      user.activeProfileId = newProfile._id;
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: newProfile,
      activeProfileId: user.activeProfileId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
    const userId = req.user._id;
    const { profileId } = req.params;

    // 1. Remove profile from DB
    await Profile.findOneAndDelete({ _id: profileId, userId });

    // 2. Remove reference from User
    const user = await User.findById(userId);
    user.profiles = user.profiles.filter((id) => id.toString() !== profileId);

    // 3. If deleted profile was active, reset to the first available or null
    if (user.activeProfileId?.toString() === profileId) {
      user.activeProfileId = user.profiles.length > 0 ? user.profiles[0] : null;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      activeProfileId: user.activeProfileId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
 
 const setActiveProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profileId } = req.body;

    const user = await User.findById(userId);

    // Security Check: Verify that the profile belongs to this user
    const belongsToUser = user.profiles.some(
      (id) => id.toString() === profileId
    );

    if (!belongsToUser) {
      return res.status(403).json({ success: false, message: "Unauthorized profile selection" });
    }

    // Set the new active profile ID
    user.activeProfileId = profileId;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Active profile updated",
      activeProfileId: user.activeProfileId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
 const getUserWithActiveProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("-password -refreshToken") // Exclude sensitive details
      .populate("profiles")
      .populate("activeProfile");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



module.exports = {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  updateMeasurements,
  deleteProfile,
  setActiveProfile,
};