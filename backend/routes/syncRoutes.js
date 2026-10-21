
const express = require("express");
const router = express.Router();

const sheets = require("../services/googleSheetsService");

// Test Google Sheets connection
router.get("/test", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    res.status(200).json({
      success: true,
      message: "Google Sheets connected successfully!",
      spreadsheetTitle: response.data.properties.title,
      tabs: response.data.sheets.map((sheet) => sheet.properties.title),
    });
  } catch (error) {
    console.error("Google Sheets error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not connect to Google Sheets.",
      error: error.message,
    });
  }
});

module.exports = router;
