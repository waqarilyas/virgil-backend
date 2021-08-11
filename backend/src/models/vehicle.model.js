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
      equired: false,
    },
    buildYear: {
      type: String,
      equired: false,
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
      equired: false,
    },
    engineSize: {
      type: String,
      equired: false,
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
