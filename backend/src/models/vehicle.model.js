const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const vehicleSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "bike"],
      default: null,
    },
    photo: {
      type: String,
      required: false,
    },
    buildYear: {
      type: String,
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    nickName: {
      type: String,
      required: true,
    },
    engineSize: {
      type: String,
      required: true,
    },
    totalTrips: {
      type: Number,
      required: false,
      default: 0,
    },
    distanceCovered: {
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
vehicleSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
