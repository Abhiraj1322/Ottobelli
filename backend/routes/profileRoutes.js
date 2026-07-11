const express = require("express");
const router = express.Router();
const {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  updateMeasurements,
  deleteProfile,
} = require("../controllers/profileControllers");
const { protect } = require("../middleware/authMiddleware");
 

router.use(protect);
 
router.get("/", getProfiles);                              // GET    /api/profiles
router.get("/:id", getProfileById);                        // GET    /api/profiles/:id
router.post("/", createProfile);                           // POST   /api/profiles
router.put("/:id", updateProfile);                         // PUT    /api/profiles/:id
router.put("/:id/measurements", updateMeasurements);       // PUT    /api/profiles/:id/measurements
router.delete("/:id", deleteProfile);                      // DELETE /api/profiles/:id
 
module.exports = router;
 