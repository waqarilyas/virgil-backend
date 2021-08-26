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
    routeLength: {
      type: String,
      required: true,
      trim: true,
    },
    totalDistanceCovered: {
      type: Number,
      required: false,
      trim: true,
    },
    timeTaken: {
      type: Number,
      required: false,
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
    totalRating: {
      type: Number,
      required: false,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Comment",
      },
    ],
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
