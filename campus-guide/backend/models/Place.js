const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      default: "general",
      index: true,
      enum: [
        "general",
        "canteen",
        "hostel",
        "classroom",
        "library",
        "lab",
        "faculty",
        "restaurant",
        "elevator",
        "stairs",
        "office",
        "medical",
        "washroom",
        "parking",
      ],
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    blockName: {
      type: String,
      default: "",
      trim: true,
    },
    floor: {
      type: String,
      default: "",
      trim: true,
    },
    cabinNumber: {
      type: String,
      default: "",
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

placeSchema.index({ name: "text", description: "text", location: "text" });

module.exports = mongoose.model("Place", placeSchema);