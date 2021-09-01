const mongoose = require("mongoose");
const geoSchema = require("./geoSchema.model");
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
    routeLocation: {
      type: geoSchema,
      index: "2dsphere",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    routeSnap: {
      type: String,
      required: false,
      default: 0,
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
    timesTaken: {
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
    lastRidden: {
      type: Date,
      required: false,
      default: Date.now,
    },
    stops: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Stop",
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
