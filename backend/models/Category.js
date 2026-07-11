const mongoose = require("mongoose");
 
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Suits & Blazers"
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
 
    section: { type: String, enum: ["classics", "everyday"], required: true },
 
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    // null = top-level (e.g. "Suits & Blazers")
    // set = sub-category (e.g. "Tuxedos" under "Suits & Blazers")
 
    order: { type: Number, default: 0 }, // controls display order in nav/scroll cards
    image: { type: String, default: "" }, // banner/thumbnail for landing & sub-category cards
  },
  { timestamps: true }
);
 
categorySchema.index({ section: 1, parentCategory: 1, order: 1 });
 
module.exports = mongoose.model("Category", categorySchema);
 