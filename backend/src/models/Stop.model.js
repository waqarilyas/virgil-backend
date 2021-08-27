const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const stopSchema = mongoose.Schema(
  {
    routeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Route",
      required: true,
    },
    coords: {
      latitude: {
        type: String,
        required: false,
        trim: true,
      },
      longitude: {
        type: String,
        required: false,
        trim: true,
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
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
stopSchema.plugin(toJSON);

/**
 * @typedef Comment
 */
const Stop = mongoose.model("Stop", stopSchema);

module.exports = Stop;
