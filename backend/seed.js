
require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("../backend/models/Category");

// All parent categories and their subcategories
const categoryData = [
  {
    section: "classics",
    name: "Suits and Blazers",
    subcategories: ["Suits", "Blazers", "Tuxedos"],
  },
  {
    section: "classics",
    name: "Dress Shirts",
    subcategories: [
      "100% Cotton",
      "Cotton-Silk Blend",
      "Cotton-Polyester Blend",
    ],
  },
  {
    section: "classics",
    name: "Pants",
    subcategories: ["Pants"],
  },
  {
    section: "classics",
    name: "Outerwear",
    subcategories: [
      "Overcoats",
      "Trench Coats",
      "Leather Jackets",
    ],
  },
  {
    section: "classics",
    name: "Accessories",
    subcategories: [
      "Belts",
      "Ties & Bow Ties",
      "Pocket Squares",
      "Cufflinks & Tie Bars",
      "Suspenders / Braces",
      "Scarves & Gloves",
      "Shoes",
    ],
  },
  {
    section: "everyday",
    name: "Shirts",
    subcategories: [
      "Long Sleeve",
      "Short Sleeve",
      "Polo Shirts",
    ],
  },
  {
    section: "everyday",
    name: "Sweaters",
    subcategories: ["Hoodies", "Sweatshirts"],
  },
  {
    section: "everyday",
    name: "Pants",
    subcategories: ["Chinos", "Casual & Sweatpants"],
  },
  {
    section: "everyday",
    name: "Wallets & Bags",
    subcategories: ["Wallets", "Hand Bags"],
  },
];

// Generate URL-friendly, unique slugs.
// Include the section and parent path because category slugs
// are unique across the entire Category collection.
function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/%/g, " percent ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function upsertCategory({
  name,
  section,
  parentCategory,
  slug,
  order,
}) {
  const filter = {
    name,
    section,
    parentCategory,
  };

  return Category.findOneAndUpdate(
    filter,
    {
      $set: { slug, order },
      $setOnInsert: {
        name,
        section,
        parentCategory,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}

async function seedCategories() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    let parentCount = 0;
    let subcategoryCount = 0;

    for (let i = 0; i < categoryData.length; i++) {
      const parent = categoryData[i];

      // 1. Create or find the parent category
      const parentCategory = await upsertCategory({
        name: parent.name,
        section: parent.section,
        parentCategory: null,
        slug: `${parent.section}-${makeSlug(parent.name)}`,
        order: i + 1,
      });

      parentCount++;

      console.log(
        `Parent category ready: ${parentCategory.name} (${parent.section})`
      );

      // 2. Create or find its subcategories
      for (let j = 0; j < parent.subcategories.length; j++) {
        const subcategoryName = parent.subcategories[j];

        await upsertCategory({
          name: subcategoryName,
          section: parent.section,
          parentCategory: parentCategory._id,
          slug: `${parent.section}-${makeSlug(parent.name)}-${makeSlug(subcategoryName)}`,
          order: j + 1,
        });

        subcategoryCount++;

        console.log(`  Subcategory ready: ${subcategoryName}`);
      }
    }

    console.log("\nCategory seeding completed.");
    console.log(`Parent categories processed: ${parentCount}`);
    console.log(`Subcategories processed: ${subcategoryCount}`);
    console.log(
      `Total category records processed: ${parentCount + subcategoryCount}`
    );
  } catch (error) {
    console.error("Category seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();
