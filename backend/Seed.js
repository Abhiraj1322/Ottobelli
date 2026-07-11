// seed.js
// Run with: node seed.js
// Make sure your .env has MONGO_URI set, and this file sits in your project root
// next to your /models folder.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Category = require("./models/Category");
const Product = require("./models/Product");

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data so this script is safe to re-run
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing categories and products.");

    // ---------- CATEGORIES: CLASSICS ----------
    const suitsBlazers = await Category.create({
      name: "Suits & Blazers",
      slug: "suits-blazers",
      section: "classics",
      order: 1,
    });
    const dressShirts = await Category.create({
      name: "Dress Shirts",
      slug: "dress-shirts",
      section: "classics",
      order: 2,
    });
    const pantsClassics = await Category.create({
      name: "Pants",
      slug: "pants-classics",
      section: "classics",
      order: 3,
    });
    const overcoats = await Category.create({
      name: "Overcoats & Outerwear",
      slug: "overcoats-outerwear",
      section: "classics",
      order: 4,
    });
    const accessoriesClassics = await Category.create({
      name: "Accessories",
      slug: "accessories-classics",
      section: "classics",
      order: 5,
    });

    // Subcategories under Suits & Blazers
    const twoOrThreePiece = await Category.create({
      name: "2 or 3 Piece Suits",
      slug: "two-or-three-piece-suits",
      section: "classics",
      parentCategory: suitsBlazers._id,
      order: 1,
    });
    const tuxedos = await Category.create({
      name: "Tuxedos",
      slug: "tuxedos",
      section: "classics",
      parentCategory: suitsBlazers._id,
      order: 2,
    });
    const blazers = await Category.create({
      name: "Blazers",
      slug: "blazers",
      section: "classics",
      parentCategory: suitsBlazers._id,
      order: 3,
    });

    // Subcategories under Dress Shirts
    const cottonShirts = await Category.create({
      name: "100% Cotton",
      slug: "cotton-dress-shirts",
      section: "classics",
      parentCategory: dressShirts._id,
      order: 1,
    });
    const cottonSilkShirts = await Category.create({
      name: "Cotton-Silk Blend",
      slug: "cotton-silk-dress-shirts",
      section: "classics",
      parentCategory: dressShirts._id,
      order: 2,
    });

    // ---------- CATEGORIES: EVERYDAY WEAR ----------
    const shirts = await Category.create({
      name: "Shirts",
      slug: "shirts",
      section: "everyday",
      order: 1,
    });
    const sweaters = await Category.create({
      name: "Sweaters",
      slug: "sweaters",
      section: "everyday",
      order: 2,
    });
    const pantsEveryday = await Category.create({
      name: "Pants",
      slug: "pants-everyday",
      section: "everyday",
      order: 3,
    });
    const jackets = await Category.create({
      name: "Jackets",
      slug: "jackets",
      section: "everyday",
      order: 4,
    });
    const accessoriesEveryday = await Category.create({
      name: "Accessories",
      slug: "accessories-everyday",
      section: "everyday",
      order: 5,
    });

    // Subcategories under Shirts
    const tshirts = await Category.create({
      name: "T-Shirts",
      slug: "t-shirts",
      section: "everyday",
      parentCategory: shirts._id,
      order: 1,
    });
    const polos = await Category.create({
      name: "Polos",
      slug: "polos",
      section: "everyday",
      parentCategory: shirts._id,
      order: 2,
    });

    // Subcategories under Pants (Everyday)
    const jeans = await Category.create({
      name: "Jeans",
      slug: "jeans",
      section: "everyday",
      parentCategory: pantsEveryday._id,
      order: 1,
    });
    const khakis = await Category.create({
      name: "Khakhis",
      slug: "khakis",
      section: "everyday",
      parentCategory: pantsEveryday._id,
      order: 2,
    });

    console.log("Categories seeded.");

    // ---------- PRODUCTS: CLASSICS (customizable) ----------
    await Product.create([
      {
        name: "Charcoal Two-Piece Suit",
        slug: "charcoal-two-piece-suit",
        section: "classics",
        category: suitsBlazers._id,
        subcategory: twoOrThreePiece._id,
        price: 1295,
        images: ["https://via.placeholder.com/600x800?text=Charcoal+Suit"],
        badge: "Best Seller",
        isCustomizable: true,
        description:
          "A timeless charcoal suit from Super 100s wool. Slim-fit jacket, flat-front trousers, fully hand-lined.",
        materials: ["Super 100s Wool", "Full Canvas", "Bemberg Lining", "Horn Buttons"],
        customizationOptions: [
          {
            section: "Jacket",
            groupName: "Shoulder Type",
            options: [
              { label: "Standard", image: "https://via.placeholder.com/150?text=Standard" },
              { label: "Roped", image: "https://via.placeholder.com/150?text=Roped" },
              { label: "Soft", image: "https://via.placeholder.com/150?text=Soft" },
            ],
          },
          {
            section: "Jacket",
            groupName: "Lapels",
            options: [
              { label: "Notch", image: "https://via.placeholder.com/150?text=Notch" },
              { label: "Peak", image: "https://via.placeholder.com/150?text=Peak" },
            ],
          },
        ],
        rating: 4.8,
        priority: 10,
        stock: 50,
        sku: "OTB-CLS-0001",
      },
      {
        name: "Navy Three-Piece Suit",
        slug: "navy-three-piece-suit",
        section: "classics",
        category: suitsBlazers._id,
        subcategory: twoOrThreePiece._id,
        price: 1495,
        images: ["https://via.placeholder.com/600x800?text=Navy+Suit"],
        badge: "New Arrival",
        isCustomizable: true,
        description: "A sharp navy three-piece, made to measure for a polished, formal look.",
        materials: ["Super 120s Wool", "Full Canvas"],
        rating: 4.6,
        priority: 9,
        stock: 40,
        sku: "OTB-CLS-0002",
      },
      {
        name: "Black Tuxedo",
        slug: "black-tuxedo",
        section: "classics",
        category: suitsBlazers._id,
        subcategory: tuxedos._id,
        price: 1695,
        images: ["https://via.placeholder.com/600x800?text=Black+Tuxedo"],
        badge: "Classic",
        isCustomizable: true,
        description: "A formal black tuxedo, satin peak lapels, fully canvassed construction.",
        materials: ["Super 130s Wool", "Satin Lapel"],
        rating: 4.9,
        priority: 8,
        stock: 25,
        sku: "OTB-CLS-0003",
      },
      {
        name: "Navy Blue Blazer",
        slug: "navy-blue-blazer",
        section: "classics",
        category: suitsBlazers._id,
        subcategory: blazers._id,
        price: 749,
        images: ["https://via.placeholder.com/600x800?text=Navy+Blazer"],
        badge: "Best Seller",
        isCustomizable: true,
        description: "A versatile navy blazer that pairs with both dress and casual trousers.",
        materials: ["Wool-Linen Blend"],
        rating: 4.7,
        priority: 7,
        stock: 60,
        sku: "OTB-CLS-0004",
      },
    ]);

    // ---------- PRODUCTS: EVERYDAY WEAR (not customizable) ----------
    await Product.create([
      {
        name: "Classic White T-Shirt",
        slug: "classic-white-tshirt",
        section: "everyday",
        category: shirts._id,
        subcategory: tshirts._id,
        price: 39,
        images: ["https://via.placeholder.com/600x800?text=White+Tee"],
        badge: "Best Seller",
        isCustomizable: false,
        description: "A soft, breathable everyday tee in 100% combed cotton.",
        materials: ["100% Cotton"],
        rating: 4.5,
        priority: 5,
        stock: 200,
        sku: "OTB-EVR-0001",
      },
      {
        name: "Navy Polo",
        slug: "navy-polo",
        section: "everyday",
        category: shirts._id,
        subcategory: polos._id,
        price: 59,
        images: ["https://via.placeholder.com/600x800?text=Navy+Polo"],
        badge: "New Arrival",
        isCustomizable: false,
        description: "A classic fit polo with a ribbed collar, perfect for smart-casual days.",
        materials: ["Pique Cotton"],
        rating: 4.4,
        priority: 4,
        stock: 150,
        sku: "OTB-EVR-0002",
      },
      {
        name: "Slim Fit Dark Wash Jeans",
        slug: "slim-fit-dark-wash-jeans",
        section: "everyday",
        category: pantsEveryday._id,
        subcategory: jeans._id,
        price: 89,
        images: ["https://via.placeholder.com/600x800?text=Dark+Jeans"],
        badge: null,
        isCustomizable: false,
        description: "A slim fit jean in a versatile dark wash, with a slight stretch for comfort.",
        materials: ["98% Cotton", "2% Elastane"],
        rating: 4.3,
        priority: 3,
        stock: 120,
        sku: "OTB-EVR-0003",
      },
      {
        name: "Khaki Chinos",
        slug: "khaki-chinos",
        section: "everyday",
        category: pantsEveryday._id,
        subcategory: khakis._id,
        price: 79,
        images: ["https://via.placeholder.com/600x800?text=Khaki+Chinos"],
        badge: null,
        isCustomizable: false,
        description: "A clean, tailored chino for everyday wear, easy to dress up or down.",
        materials: ["Cotton Twill"],
        rating: 4.2,
        priority: 2,
        stock: 100,
        sku: "OTB-EVR-0004",
      },
    ]);

    console.log("Products seeded.");
    console.log("Seeding complete!");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seed();