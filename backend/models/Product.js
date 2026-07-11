const mongoose = require("mongoose");
 
// One selectable option inside a customization group, e.g. Shoulder Type -> "Standard"
const customizationOptionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // "Standard"
    image: { type: String, default: "" }, // swatch/illustration shown for click-to-select
    description: { type: String, default: "" },
    priceAdjustment: { type: Number, default: 0 }, // optional upcharge for this option
  },
  { _id: false }
);
 
// One group/section in the customization form, e.g. "Jacket > Shoulder Type"
const customizationGroupSchema = new mongoose.Schema(
  {
    section: { type: String, required: true }, // "Jacket", "Lapels", "Lining", etc.
    groupName: { type: String, required: true }, // "Shoulder Type"
    options: [customizationOptionSchema],
  },
  { _id: false }
);
 
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
 
    section: { type: String, enum: ["classics", "everyday"], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // top-level
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // level 2
 
    price: { type: Number, required: true },
    currency: { type: String, default: "CAD" },
 
    images: [{ type: String, required: true }],
    badge: {
      type: String,
      enum: ["Best Seller", "New Arrival", "Limited", "Classic", null],
      default: null,
    },
 
    isCustomizable: { type: Boolean, default: false }, // true only for Classics items
 
    description: { type: String, default: "" },
    materials: [{ type: String }],
 
    customizationOptions: [customizationGroupSchema], // only populated when isCustomizable = true
 
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // "customers also bought"
 
    rating: { type: Number, default: 0 },
    priority: { type: Number, default: 0 }, // backend-controlled sort weight for listing order
 
    stock: { type: Number, default: 0 },
    sku: { type: String, unique: true, sparse: true },
 
    careInfo: { type: String, default: "" },
    returnPolicyText: { type: String, default: "Fit Right Guarantee · Returns & Exchanges" },
  },
  { timestamps: true }
);
 
productSchema.index({ section: 1, category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ priority: -1 });
 
module.exports = mongoose.model("Product", productSchema);