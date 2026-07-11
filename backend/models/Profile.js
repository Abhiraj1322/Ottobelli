const mongoose = require("mongoose");
 
const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 
    displayName: { type: String, required: true, trim: true }, // e.g. "Myself", "456465", "Brother"
 
    measurements: {
      neckCollar: { type: Number, default: null },
      chest: { type: Number, default: null },
      shoulderWidth: { type: Number, default: null },
      sleeve: { type: Number, default: null },
      torso: { type: Number, default: null },
      stomach: { type: Number, default: null },
      hip: { type: Number, default: null },
      bicep: { type: Number, default: null },
      wrist: { type: Number, default: null },
      waist: { type: Number, default: null },
      legs: { type: Number, default: null },
      crotch: { type: Number, default: null },
      thighs: { type: Number, default: null },
      knees: { type: Number, default: null },
    },
 
    preferredFit: { type: String, enum: ["Slim", "Regular", "Relaxed", null], default: null },
    fabricsToAvoid: [{ type: String }],
    referencePhotos: [{ type: String }], // Cloudinary/S3 URLs
    specialInstructions: { type: String, default: "" },
  },
  { timestamps: true }
);
 
// Virtual: how many of the 14 measurement fields are filled in (e.g. "8/14 filled")
profileSchema.virtual("completionStatus").get(function () {
  const fields = Object.values(this.measurements || {});
  const filled = fields.filter((v) => v !== null && v !== undefined).length;
  return `${filled}/${fields.length} filled`;
});
 
profileSchema.set("toJSON", { virtuals: true });
profileSchema.set("toObject", { virtuals: true });
 
module.exports = mongoose.model("Profile", profileSchema);
 