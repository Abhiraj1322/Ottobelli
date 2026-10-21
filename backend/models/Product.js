
const mongoose = require("mongoose");

// Customization option
const customizationOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    priceAdjustment: { type: Number, default: 0 },
  },
  { _id: false }
);

// Customization group
const customizationGroupSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    groupName: { type: String, required: true },
    options: [customizationOptionSchema],
  },
  { _id: false }
);

// Stock for each size, such as S: 5 or 32: 4
const sizeStockSchema = new mongoose.Schema(
  {
    size: { type: String, required: true, trim: true },
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    // Excel product identity
    itemNumber: {
      type: Number,
      unique: true,
      sparse: true,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    gender: {
      type: String,
      default: "Men",
      trim: true,
    },

    // Category relationships
    section: {
      type: String,
      enum: ["classics", "everyday"],
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Customization settings from Excel
    isCustomizable: {
      type: Boolean,
      default: false,
    },

    customizationForm: {
      type: String,
      default: "",
    },

    customizationOptions: {
      type: [customizationGroupSchema],
      default: [],
    },

    // Product and fabric details
    materials: [{
      type: String,
      trim: true,
    }],

    mill: {
      type: String,
      default: "",
      trim: true,
    },

    superCount: {
      type: String,
      default: "",
      trim: true,
    },

    colour: {
      type: String,
      required: true,
      trim: true,
    },

    pattern: {
      type: String,
      default: "",
      trim: true,
    },

    season: {
      type: String,
      default: "",
      trim: true,
    },

    // Pricing from Excel
    cost: {
      type: Number,
      min: 0,
    },

    markupPct: {
      type: Number,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    salePct: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    salePrice: {
      type: Number,
      min: 0,
    },

    currency: {
      type: String,
      default: "CAD",
      uppercase: true,
    },

    // Inventory
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    sizeStock: {
      type: [sizeStockSchema],
      default: [],
    },

    sizes: [{
      type: String,
      trim: true,
    }],

    // Images from Image 1 URL through Image 4 URL
    imageFolder: {
      type: String,
      default: "",
    },

    images: [{
      type: String,
      trim: true,
    }],

    // Storefront display
    status: {
      type: String,
      enum: ["Active", "Draft", "Inactive"],
      default: "Draft",
    },

    badge: {
      type: String,
      enum: [
        "Best Seller",
        "New Arrival",
        "Limited",
        "Classic",
        null,
      ],
      default: null,
    },

    priority: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    description: {
      type: String,
      default: "",
    },

    careInfo: {
      type: String,
      default: "",
    },

    returnPolicyText: {
      type: String,
      default: "Fit Right Guarantee · Returns & Exchanges",
    },

    relatedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for product listing and filtering
productSchema.index({
  section: 1,
  category: 1,
  subcategory: 1,
});

productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ priority: -1 });
productSchema.index({ status: 1, priority: -1 });

module.exports = mongoose.model("Product", productSchema);
