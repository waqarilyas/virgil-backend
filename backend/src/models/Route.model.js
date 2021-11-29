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
    description: {
      type: String,
    },
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
      type: Number,
      required: true,
      default: 0,
    },
    totalDistanceCovered: {
      type: Number,
      required: false,
      trim: true,
    },
    timesTaken: {
      type: Number,
      required: false,
      default: 0,
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
    numStops: {
      type: Number,
      required: false,
      default: 0,
    },
    totalTimeTaken: {
      type: Number,
      required: false,
      default: 0,
    },
    currentRiders: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    numCurrentRiders: {
      type: Number,
      required: false,
      default: 0,
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
