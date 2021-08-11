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
    manufacturer: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      equired: false,
    },
    nickName: {
      type: String,
      equired: false,
    },
    buildYear: {
      type: String,
      equired: false,
    },
    photo: {
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
