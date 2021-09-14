const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: false,
      trim: true,
    },
    extraInfo: {
      notificationType: String,
      documentName: String,
      relatedDocumentId: String,
    },
    request: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Requests",
    },
    route: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Route",
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
