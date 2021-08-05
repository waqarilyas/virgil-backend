const mongoose = require("mongoose");
const emailTrigger = require("../triggers/triggers");
const DEFAULTS = require("./default");
// let chaneEvents = DEFAULTS.MONGO_CHANGE_EVENTS
let url = DEFAULTS.DATABASE_PATH;

mongoose
  .connect(url, {
    dbName: DEFAULTS.DB_NAME,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log("error", err);
  });

mongoose.Promise = global.Promise;
