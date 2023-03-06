const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const commentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    route: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Route",
      required: true,
    },
    message: {
      type: String,
      required: false,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
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
commentSchema.plugin(toJSON);

/**
 * @typedef Comment
 */
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
