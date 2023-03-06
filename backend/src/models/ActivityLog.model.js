const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const activityLogSchema = mongoose.Schema(
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
      activityType: String,
      documentName: String,
      relatedDocumentId: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
activityLogSchema.plugin(toJSON);

/**
 * @typedef Comment
 */
const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
