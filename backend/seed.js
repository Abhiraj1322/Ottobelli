
const mongoose = require("mongoose");
const Category = require("./models/Category");
require("dotenv").config();

const categories = [
  {
    name: "Suits and Blazers",
    slug: "suits-and-blazers",
    section: "classics",
    order: 1,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    subcategories: ["Suits", "Blazers", "Tuxedos"]
  },
  {
    name: "Dress Shirts",
    slug: "dress-shirts",
    section: "classics",
    order: 2,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
    subcategories: [
      "100% Cotton",
      "Cotton-Silk Blend",
      "Cotton-Polyester Blend"
    ]
  },
  {
    name: "Pants",
    slug: "pants",
    section: "classics",
    order: 3,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
    subcategories: ["Pants"]
  },
  {
    name: "Outerwear",
    slug: "outerwear",
    section: "classics",
    order: 4,
    image: "https://images.unsplash.com/photo-1544923246-77307dd654cb",
    subcategories: ["Overcoats", "Trench Coats", "Leather Jackets"]
  },
  {
    name: "Accessories",
    slug: "accessories",
    section: "classics",
    order: 5,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d",
    subcategories: [
      "Belts",
      "Ties & Bow Ties",
      "Pocket Squares",
      "Cufflinks & Tie Bars",
      "Suspenders / Braces",
      "Scarves & Gloves",
      "Shoes"
    ]
  },
  {
    name: "Shirts",
    slug: "shirts",
    section: "everyday",
    order: 1,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157",
    subcategories: ["Long Sleeve", "Short Sleeve", "Polo Shirts"]
  },
  {
    name: "Sweaters",
    slug: "sweaters",
    section: "everyday",
    order: 2,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    subcategories: ["Hoodies", "Sweatshirts"]
  },
  {
    name: "Pants",
    slug: "everyday-pants",
    section: "everyday",
    order: 3,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
    subcategories: ["Chinos", "Casual & Sweatpants"]
  },
  {
    name: "Wallets & Bags",
    slug: "wallets-and-bags",
    section: "everyday",
    order: 4,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    subcategories: ["Wallets", "Hand Bags"]
  }
];

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function seedCategories() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let parentCount = 0;
    let subcategoryCount = 0;

    for (const item of categories) {
      // Create or update the parent category.
      const parent = await Category.findOneAndUpdate(
        {
          section: item.section,
          slug: item.slug
        },
        {
          $set: {
            name: item.name,
            section: item.section,
            parentCategory: null,
            order: item.order,
            image: item.image
          }
        },
        {
          upsert: true,
          new: true,
          runValidators: true
        }
      );

      parentCount++;

      for (let i = 0; i < item.subcategories.length; i++) {
        const subcategoryName = item.subcategories[i];

        // Include the parent slug in the child slug to
        // ensure slugs remain unique across the collection.
        const subcategorySlug =
          `${createSlug(subcategoryName)}-${item.slug}`;

        await Category.findOneAndUpdate(
          {
            section: item.section,
            slug: subcategorySlug
          },
          {
            $set: {
              name: subcategoryName,
              slug: subcategorySlug,
              section: item.section,
              parentCategory: parent._id,
              order: i + 1,
              image: ""
            }
          },
          {
            upsert: true,
            new: true,
            runValidators: true
          }
        );

        subcategoryCount++;
      }

      console.log(`Seeded: ${item.name}`);
    }

    console.log("\nCategory seeding completed!");
    console.log(`Parent categories: ${parentCount}`);
    console.log(`Subcategories: ${subcategoryCount}`);
    console.log(`Total categories: ${parentCount + subcategoryCount}`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();
