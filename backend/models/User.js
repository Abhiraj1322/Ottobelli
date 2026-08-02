
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
      // Reference to the currently active profile

profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  activeProfileId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Profile", 
    default: null 
  },
  
      orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  
      refreshToken: { type: String }, // for JWT refresh flow
    },
    { timestamps: true ,
      toJSON: { virtuals: true },
    toObject: { virtuals: true }
    }
  );
  // Virtual field: easily populate the active profile directly
userSchema.virtual("activeProfile", {
  ref: "Profile",
  localField: "activeProfileId",
  foreignField: "_id",
  justOne: true,
});
  
  module.exports = mongoose.model("User", userSchema);