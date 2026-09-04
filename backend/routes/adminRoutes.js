const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const Category = require("../models/Category.js");
const Product = require("../models/Product.js");
const { uploadimage } = require("../config/cloudinary.js")
// Optional: Import your admin protection middleware
// const { protect, adminOnly } = require("../middleware/authMiddleware.js");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

// Endpoint: POST /api/admin/products/bulk-upload
router.post(
  "/upload-products-excel",
  /* protect, adminOnly, */ upload.single("excelFile"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
      }

      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

      if (!sheetData || sheetData.length === 0) {
        return res.status(400).json({ success: false, message: "Excel sheet is empty." });
      }

      // Build Category Lookup Maps in RAM
const allCategories = await Category.find({}).lean();
const topCategoryMap = new Map();
const subCategoryMap = new Map();

allCategories.forEach((cat) => {
  const cleanedName = cat.name.trim().toLowerCase();
  if (!cat.parentCategory) {
    topCategoryMap.set(`${cat.section.toLowerCase()}_${cleanedName}`, cat._id);
  } else {
    subCategoryMap.set(`${cat.parentCategory.toString()}_${cleanedName}`, cat._id);
  }
});

const bulkOperations = [];
const validationErrors = [];

// Changed from sheetData.forEach to async for...of loop
for (const [index, row] of sheetData.entries()) {
  const rowNum = index + 2;

  const name = row["name"] ? String(row["name"]).trim() : null;
  const section = row["section"] ? String(row["section"]).trim().toLowerCase() : null;
  const catName = row["categoryName"] ? String(row["categoryName"]).trim().toLowerCase() : null;
  const subCatName = row["subcategoryName"] ? String(row["subcategoryName"]).trim().toLowerCase() : null;
  const price = Number(row["price"]);
  const sku = row["sku"] ? String(row["sku"]).trim() : null;

  if (!name || !section || !catName || !subCatName || isNaN(price)) {
    validationErrors.push({
      row: rowNum,
      error: "Missing required fields: name, section, categoryName, subcategoryName, or valid price.",
    });
    continue;
  }

  if (!["classics", "everyday"].includes(section)) {
    validationErrors.push({
      row: rowNum,
      error: `Invalid section '${section}'. Must be 'classics' or 'everyday'.`,
    });
    continue;
  }

  // 1. Look up parent category
  const topKey = `${section}_${catName}`;
  const categoryId = topCategoryMap.get(topKey);

  if (!categoryId) {
    validationErrors.push({
      row: rowNum,
      error: `Category '${row["categoryName"]}' not found under section '${section}'.`,
    });
    continue;
  }

  // 2. Look up OR auto-create subcategory
  const subKey = `${categoryId.toString()}_${subCatName}`;
  let subcategoryId = subCategoryMap.get(subKey);

  if (!subcategoryId) {
    const rawSubCatName = String(row["subcategoryName"]).trim();
    const subSlug = slugify(`${row["categoryName"]}-${rawSubCatName}`, { lower: true });

    // Auto-create subcategory in database
    const newSubCategory = await Category.create({
      name: rawSubCatName,
      slug: subSlug,
      section,
      parentCategory: categoryId,
    });

    subcategoryId = newSubCategory._id;
    // Cache in RAM for subsequent rows in the same CSV file
    subCategoryMap.set(subKey, subcategoryId);
  }

  const imagesArray = row["images"]
    ? String(row["images"]).split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  if (imagesArray.length === 0) {
    validationErrors.push({ row: rowNum, error: "At least one image URL is required." });
    continue;
  }

  const materialsArray = row["materials"]
    ? String(row["materials"]).split(",").map((m) => m.trim()).filter(Boolean)
    : [];

  const generatedSlug = slugify(sku ? `${name}-${sku}` : name, { lower: true });

  const productData = {
    name,
    slug: generatedSlug,
    section,
    category: categoryId,
    subcategory: subcategoryId,
    price,
    currency: row["currency"] || "CAD",
    images: imagesArray,
    badge: row["badge"] === "null" || !row["badge"] ? null : row["badge"],
    isCustomizable: section === "classics",
    description: row["description"] || "",
    materials: materialsArray,
    stock: Number(row["stock"] || 0),
    careInfo: row["careInfo"] || "",
    returnPolicyText: row["returnPolicyText"] || "Fit Right Guarantee · Returns & Exchanges",
  };

  if (sku) productData.sku = sku;

  bulkOperations.push({
    updateOne: {
      filter: sku ? { sku } : { slug: generatedSlug },
      update: { $set: productData },
      upsert: true,
    },
  });
}
      const dbResult = await Product.bulkWrite(bulkOperations);

      return res.status(200).json({
        success: true,
        message: "Bulk upload executed successfully!",
        createdCount: dbResult.upsertedCount,
        updatedCount: dbResult.modifiedCount,
        errors: validationErrors,
      });
    } catch (error) {
      console.error("Bulk Upload Error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error." });
    }
  }
);
router.post("/upload-bulk-images", uploadimage.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    // req.files is an array of uploaded Cloudinary file objects
    const imageUrls = req.files.map((file) => file.path || file.secure_url);

    return res.status(200).json({
      success: true,
      count: imageUrls.length,
      imageUrls: imageUrls, // Array of hosted HTTPS URLs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;