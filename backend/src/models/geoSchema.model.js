const { Schema } = require("mongoose");

const geoSchema = new Schema({
  type: {
    type: String,
    default: "Point",
  },
  coordinates: {
    type: [Number],
  },
});

// geoSchema.plugin(toJSON);
// const Geo = mongoose.model("Geo", geoSchema);

module.exports = geoSchema;
