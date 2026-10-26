
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Category = require("../models/Category");
const sheets = require("../services/googleSheetsService");

// 1. GET: Test Google Sheets connection
router.get("/test", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    return res.status(200).json({
      success: true,
      message: "Google Sheets connected successfully!",
      spreadsheetTitle: response.data.properties.title,
      tabs: response.data.sheets.map(
        (sheet) => sheet.properties.title
      ),
    });
  } catch (error) {
    console.error("Google Sheets error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not connect to Google Sheets.",
      error: error.message,
    });
  }
});

// 2. GET: Preview product rows without saving
router.get("/preview", async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "'Suits'!A1:AZ10",
    });

    const rows = response.data.values || [];

    return res.status(200).json({
      success: true,
      sheet: "Suits",
      headers: rows[0] || [],
      sampleRows: rows.slice(1),
    });
  } catch (error) {
    console.error("Preview error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not preview spreadsheet data.",
      error: error.message,
    });
  }
});

// Sync one tab or every configured product tab into MongoDB
const PRODUCT_SHEETS = [
  "Suits",
  "Blazers",
  "Tuxedos",
  "100% Cotton",
  "Cotton-Silk Blend",
  "Cotton-Polyester Blend",
  "Pants",
  "Overcoats",
  "Trench Coats",
  "Leather Jackets",
  "Belts",
  "Ties & Bow Ties",
  "Pocket Squares",
  "Cufflinks & Tie Bars",
  "Suspenders & Braces",
  "Scarves & Gloves",
  "Shoes",
  "Long Sleeve",
  "Short Sleeve",
  "Polo Shirts",
  "Hoodies",
  "Sweatshirts",
  "Chinos",
  "Casual & Sweatpants",
  "Wallets",
  "Hand Bags",
];

// Convert values such as "$1,170.00" or "160%" to numbers.
function parseNumber(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const cleaned = String(value).replace(/[$,%\s,]/g, "");
  const number = Number(cleaned);

  return Number.isFinite(number) ? number : undefined;
}

function parseBoolean(value) {
  return ["yes", "true", "1"].includes(
    String(value ?? "").trim().toLowerCase()
  );
}

function makeSlug(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/%/g, " percent ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseList(value) {
  if (!value) return [];

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanImages(row) {
  return [row.image1, row.image2, row.image3, row.image4]
    .map((url) => String(url ?? "").trim())
    .filter((url) => /^https?:\/\//i.test(url));
}

// POST /api/sync/products
// POST /api/sync/products?sheet=Suits
router.post("/products", async (req, res) => {
  const requestedSheet = req.query.sheet;

  if (
    requestedSheet &&
    !PRODUCT_SHEETS.includes(requestedSheet)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid sheet name.",
      allowedSheets: PRODUCT_SHEETS,
    });
  }

  const sheetsToSync = requestedSheet
    ? [requestedSheet]
    : PRODUCT_SHEETS;

  const report = [];

  try {
    for (const sheetName of sheetsToSync) {
      const sheetResult = {
        sheet: sheetName,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
      };

      try {
        // Read the Google Sheet.
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `'${sheetName.replace(/'/g, "''")}'!A1:AZ`,
        });

        const rows = response.data.values || [];

        // Row 1 = display headers
        // Row 2 = backend field names
        // Row 3 = example/template row
        if (rows.length < 3) {
          sheetResult.errors.push({
            message: "Sheet does not contain enough rows.",
          });

          report.push(sheetResult);
          continue;
        }

        const fieldNames = rows[1].map((field) =>
          String(field ?? "").trim()
        );

        // Convert each spreadsheet row into an object.
        const productRows = rows.slice(2).map((values) => {
          const row = {};

          fieldNames.forEach((field, index) => {
            if (field) {
              row[field] = values[index] ?? "";
            }
          });

          return row;
        });

        for (let i = 0; i < productRows.length; i++) {
          const row = productRows[i];
          const rowNumber = i + 3;

          try {
            const name = String(row.name ?? "").trim();
          const status = String(row.status ?? "").trim();

// Ignore empty rows and the example/template product.
if (
  !name ||
  !status ||
  status.toLowerCase() === "example"
) {
  sheetResult.skipped++;
  continue;
}

            const sku = String(row.sku ?? "").trim();
            const itemNumber = String(
              row.itemNumber ?? ""
            ).trim();

            const section = String(
              row.section ?? ""
            ).trim().toLowerCase();

            if (!sku && !itemNumber) {
              throw new Error(
                "A SKU or item number is required."
              );
            }

            if (!["classics", "everyday"].includes(section)) {
              throw new Error(
                `Invalid section: ${section}`
              );
            }

            if (!row.categoryName || !row.subcategoryName) {
              throw new Error(
                "Category and subcategory are required."
              );
            }

            // Find the parent category.
            const category = await Category.findOne({
              name: String(row.categoryName).trim(),
              section,
              parentCategory: null,
            });

            if (!category) {
              throw new Error(
                `Category not found: ${row.categoryName}`
              );
            }

            // Find the subcategory under that parent.
            const subcategory = await Category.findOne({
              name: String(row.subcategoryName).trim(),
              section,
              parentCategory: category._id,
            });

            if (!subcategory) {
              throw new Error(
                `Subcategory "${row.subcategoryName}" not found under "${category.name}".`
              );
            }

            const price = parseNumber(row.price);

            if (price === undefined) {
              throw new Error("A valid retail price is required.");
            }

            if (!String(row.colour ?? "").trim()) {
              throw new Error("Colour is required.");
            }

            if (!String(row.materials ?? "").trim()) {
              throw new Error("Material is required.");
            }

            const productData = {
              name,
              section,
              category: category._id,
              subcategory: subcategory._id,

              sku: sku || undefined,
              itemNumber: itemNumber || undefined,

              gender: String(row.gender ?? "").trim(),
              status,
              isCustomizable: parseBoolean(row.isCustomizable),
              customizationForm: String(
                row.customizationForm ?? ""
              ).trim(),

              materials: parseList(row.materials),
              mill: String(row.mill ?? "").trim(),
              superCount: String(row.superCount ?? "").trim(),
              colour: String(row.colour).trim(),
              pattern: String(row.pattern ?? "").trim(),
              season: String(row.season ?? "").trim(),

              cost: parseNumber(row.cost),
              markupPct: parseNumber(row.markupPct),
              price,
              salePct: parseNumber(row.salePct),
              salePrice: parseNumber(row.salePrice),

              currency: String(row.currency || "CAD")
                .trim()
                .toUpperCase(),

              stock: parseNumber(row.stock) ?? 0,
              badge: String(row.badge ?? "").trim() || null,
              priority: parseNumber(row.priority) ?? 0,

              description: String(row.description ?? "").trim(),
              careInfo: String(row.careInfo ?? "").trim(),
              returnPolicyText: String(
                row.returnPolicyText ?? ""
              ).trim(),

              imageFolder: String(row.imageFolder ?? "").trim(),
              images: cleanImages(row),
            };

        
          } catch (error) {
            sheetResult.errors.push({
              row: rowNumber,
              product: row.name || "(unnamed product)",
              message: error.message,
            });
          }
        }
      } catch (error) {
        sheetResult.errors.push({
          message: error.message,
        });
      }

      report.push(sheetResult);
    }

    const totals = report.reduce(
      (result, sheet) => ({
        created: result.created + sheet.created,
        updated: result.updated + sheet.updated,
        skipped: result.skipped + sheet.skipped,
        errors: result.errors + sheet.errors.length,
      }),
      { created: 0, updated: 0, skipped: 0, errors: 0 }
    );

    return res.status(200).json({
      success: totals.errors === 0,
      message: "Product sync finished.",
      totals,
      sheets: report,
    });
  } catch (error) {
    console.error("Product sync failed:", error);

    return res.status(500).json({
      success: false,
      message: "Product sync failed.",
      error: error.message,
    });
  }
});

module.exports = router;
