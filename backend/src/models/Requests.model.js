const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const requestsSchema = mongoose.Schema(
  {
    requestFrom: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    requestTo: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      required: false,
      trim: true,
      default: "notAccepted",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
requestsSchema.plugin(toJSON);

/**
 * @typedef Comment
 */
const Requests = mongoose.model("Requests", requestsSchema);

module.exports = Requests;
