
const mongoose = require("mongoose");
 
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // store bcrypt hash, never plaintext
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
 
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
 
    addresses: [
      {
        label: { type: String }, // e.g. "Home", "Office"
        line1: String,
        line2: String,
        city: String,
        province: String,
        postalCode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
 
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
 
    refreshToken: { type: String }, // for JWT refresh flow
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("User", userSchema);