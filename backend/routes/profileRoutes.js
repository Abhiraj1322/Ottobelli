const express = require("express");
const router = express.Router();
const {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  updateMeasurements,
  deleteProfile,
  setActiveProfile
} = require("../controllers/profileControllers");
const { protect } = require("../middleware/authMiddleware");
 

router.use(protect);

// -------------------------------------------------------------
// Base & Action Routes
// -------------------------------------------------------------
router.get("/", getProfiles);            // GET  /api/profiles (List user's profiles)
router.post("/", createProfile);         // POST /api/profiles (Create new profile)
router.put("/switch", setActiveProfile); // PUT  /api/profiles/switch (Switch active profile)

// -------------------------------------------------------------
// Parametric Routes (Must come AFTER specific action routes)
// -------------------------------------------------------------
router.get("/:id", getProfileById);               // GET    /api/profiles/:id
router.put("/:id", updateProfile);                // PUT    /api/profiles/:id
router.put("/:id/measurements", updateMeasurements); // PUT /api/profiles/:id/measurements
router.delete("/:id", deleteProfile);             // DELETE /api/profiles/:id
module.exports = router;
 