const mongoose = require("mongoose");
 
// Snapshot of the choices a user made in the customization form for one cart item.
const customizationSelectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
 
    // e.g. { "Shoulder Type": "Standard", "Lapels": "Notch", "Buttons": "Two" }
    selections: { type: Map, of: String, required: true },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("CustomizationSelection", customizationSelectionSchema);
 