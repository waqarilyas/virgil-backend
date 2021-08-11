const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const routeSchema = mongoose.Schema(
  {
    rideName: {
      type: String,
      required: true,
      trim: true,
    },
    descriptors: [String],
    isPublic: {
      type: Boolean,
      required: true,
    },
    coordinates: {
      type: Array,
      default: [],
      required: true,
    },
    routeSnap: {
      type: String,
      required: false,
    },
    distanceCovered: {
      type: String,
      required: true,
      trim: true,
    },
    timeTaken: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    riddenBy: {
      type: Array,
      default: [],
      required: false,
    },
    reviews: {
      type: Array,
      default: [],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
routeSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
