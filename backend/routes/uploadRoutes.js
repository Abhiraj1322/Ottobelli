// routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadmiddlewere");

// Route: POST /api/upload/reference-photo
router.post("/reference-photo", upload.single("photo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Build the public URL string
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      url: fileUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Server file upload error" });
  }
});

module.exports = router;