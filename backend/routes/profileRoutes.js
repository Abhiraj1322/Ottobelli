const express = require("express");
const router = express.Router();
const {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  updateMeasurements,
  deleteProfile,
  switchActiveProfile
} = require("../controllers/profileControllers");
const { protect } = require("../middleware/authMiddleware");
 

router.use(protect);
  router.put("/switch", switchActiveProfile);
router.get("/", getProfiles); 
router.post("/", createProfile);                               // GET    /api/profiles
router.get("/:id", getProfileById);                        // GET    /api/profiles/:id                        // POST   /api/profiles
router.put("/:id", updateProfile);                         // PUT    /api/profiles/:id
router.put("/:id/measurements", updateMeasurements);       // PUT    /api/profiles/:id/measurements
router.delete("/:id", deleteProfile);                      // DELETE /api/profiles/:id

module.exports = router;
 