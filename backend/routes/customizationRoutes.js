
const express = require("express");
const router = express.Router();
const {
  createCustomization,
  getCustomization,
  updateCustomization,
} = require("../controllers/customizeController");
const { protect } = require("../middleware/authMiddleware");
 
// All customization routes are protected
router.use(protect);
 
router.post("/", createCustomization);         // POST   /api/customizations
router.get("/:id", getCustomization);          // GET    /api/customizations/:id
router.put("/:id", updateCustomization);       // PUT    /api/customizations/:id
 
module.exports = router;
 