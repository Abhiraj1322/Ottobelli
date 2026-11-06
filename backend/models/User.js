
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Customer information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Authentication
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // Customer's general saved style preferences
    savedStyle: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Customer profiles
    profiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],

    activeProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      default: null,
    },

    // Favorites
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // Customer addresses
    addresses: [
      {
        label: String,
        line1: String,
        line2: String,
        city: String,
        province: String,
        postalCode: String,
        country: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Orders
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    // JWT refresh flow
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field: populate active profile
userSchema.virtual("activeProfile", {
  ref: "Profile",
  localField: "activeProfileId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("User", userSchema);
