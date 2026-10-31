
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Category = require("../models/Category");
const sheets = require("../services/googleSheetsService");

// --------------------------------------------------
// 1. GET: Test Google Sheets connection
// GET /api/sync/test
// --------------------------------------------------

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

// --------------------------------------------------
// 2. GET: Preview product rows without saving
// GET /api/sync/preview
// --------------------------------------------------

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

// --------------------------------------------------
// 3. Product sheet names
// --------------------------------------------------

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

// --------------------------------------------------
// 4. Helper functions
// --------------------------------------------------

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

function parseList(value) {
  if (!value) return [];

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanImages(row) {
  return [
    row.image1,
    row.image2,
    row.image3,
    row.image4,
  ]
    .map((url) => String(url ?? "").trim())
    .filter((url) => /^https?:\/\//i.test(url));
}

// --------------------------------------------------
// 5. POST: Sync Google Sheets products to MongoDB
//
// All sheets:
// POST /api/sync/products
//
// One sheet:
// POST /api/sync/products?sheet=Suits
// --------------------------------------------------

router.post("/products", async (req, res) => {
  const requestedSheet = req.query.sheet;

  // Validate requested sheet name.
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
        // Row 4 onward = actual products

        if (rows.length < 3) {
          sheetResult.errors.push({
            message: "Sheet does not contain enough rows.",
          });

          report.push(sheetResult);
          continue;
        }

        // Get backend field names from row 2.
        const fieldNames = rows[1].map((field) =>
          String(field ?? "").trim()
        );

        // Convert spreadsheet rows into JavaScript objects.
        const productRows = rows.slice(2).map((values) => {
          const row = {};

          fieldNames.forEach((field, index) => {
            if (field) {
              row[field] = values[index] ?? "";
            }
          });

          return row;
        });

        // Process each product row.
        for (let i = 0; i < productRows.length; i++) {
          const row = productRows[i];
          const rowNumber = i + 3;

          try {
            const name = String(row.name ?? "").trim();
            const rawStatus = String(row.status ?? "").trim();

            // Skip empty rows and example/template rows.
            if (
              !name ||
              !rawStatus ||
              rawStatus.toLowerCase() === "example"
            ) {
              sheetResult.skipped++;
              continue;
            }

            // Normalize status.
            const normalizedStatus = rawStatus.toLowerCase();

            if (!["active", "draft"].includes(normalizedStatus)) {
              throw new Error(
                `Invalid product status: ${rawStatus}`
              );
            }

            const status =
              normalizedStatus === "active" ? "Active" : "Draft";

            const sku = String(row.sku ?? "").trim();

            const itemNumber = String(
              row.itemNumber ?? ""
            ).trim();

            const numericItemNumber = itemNumber
              ? Number(itemNumber)
              : undefined;

            if (
              itemNumber &&
              !Number.isFinite(numericItemNumber)
            ) {
              throw new Error("Item number must be a valid number.");
            }

            const section = String(
              row.section ?? ""
            )
              .trim()
              .toLowerCase();

            // Require SKU or item number.
            if (!sku && !itemNumber) {
              throw new Error(
                "A SKU or item number is required."
              );
            }

            // Validate section.
            if (!["classics", "everyday"].includes(section)) {
              throw new Error(
                `Invalid section: ${section}`
              );
            }

            // Validate category fields.
            const categoryName = String(
              row.categoryName ?? ""
            ).trim();

            const subcategoryName = String(
              row.subcategoryName ?? ""
            ).trim();

            if (!categoryName || !subcategoryName) {
              throw new Error(
                "Category and subcategory are required."
              );
            }

            // Find parent category.
            const category = await Category.findOne({
              name: categoryName,
              section,
              parentCategory: null,
            });

            if (!category) {
              throw new Error(
                `Category not found: ${categoryName}`
              );
            }

            // Find subcategory under the parent.
            const subcategory = await Category.findOne({
              name: subcategoryName,
              section,
              parentCategory: category._id,
            });

            if (!subcategory) {
              throw new Error(
                `Subcategory "${subcategoryName}" not found under "${category.name}".`
              );
            }

            // Validate price.
            const price = parseNumber(row.price);

            if (price === undefined) {
              throw new Error(
                "A valid retail price is required."
              );
            }

            // Validate colour.
            const colour = String(row.colour ?? "").trim();

            if (!colour) {
              throw new Error("Colour is required.");
            }

            // Validate materials.
            const materials = parseList(row.materials);

            if (materials.length === 0) {
              throw new Error("Material is required.");
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

            // Build product object.
            const productData = {
              name,
              slug: makeSlug(name),  
              section,

              category: category._id,
              subcategory: subcategory._id,

              sku: sku || undefined,
              itemNumber: numericItemNumber,

              gender: String(row.gender ?? "").trim(),
              status,
              isCustomizable: parseBoolean(row.isCustomizable),

              customizationForm: String(
                row.customizationForm ?? ""
              ).trim(),

              materials,
              mill: String(row.mill ?? "").trim(),
              superCount: String(row.superCount ?? "").trim(),

              colour,
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

            // --------------------------------------------------
            // SAVE TO MONGODB
            // --------------------------------------------------

            // Use SKU as the primary identifier when available.
            // Otherwise, use item number.
            const filter = sku
              ? { sku }
              : { itemNumber: numericItemNumber };

            const existingProduct = await Product.findOne(filter);

            if (existingProduct) {
              // Update existing product.
              await Product.updateOne(
                { _id: existingProduct._id },
                { $set: productData },
                { runValidators: true }
              );

              sheetResult.updated++;

              console.log(`Updated product: ${name}`);
            } else {
              // Create new product.
              await Product.create(productData);

              sheetResult.created++;

              console.log(`Created product: ${name}`);
            }
          } catch (error) {
            console.error(
              `Error in ${sheetName}, row ${rowNumber}:`,
              error.message
            );

            sheetResult.errors.push({
              row: rowNumber,
              product: row.name || "(unnamed product)",
              message: error.message,
            });
          }
        }
      } catch (error) {
        console.error(
          `Error reading sheet ${sheetName}:`,
          error.message
        );

        sheetResult.errors.push({
          message: error.message,
        });
      }

      report.push(sheetResult);
    }

    // Calculate totals across all sheets.
    const totals = report.reduce(
      (result, sheet) => ({
        created: result.created + sheet.created,
        updated: result.updated + sheet.updated,
        skipped: result.skipped + sheet.skipped,
        errors: result.errors + sheet.errors.length,
      }),
      {
        created: 0,
        updated: 0,
        skipped: 0,
        errors: 0,
      }
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
