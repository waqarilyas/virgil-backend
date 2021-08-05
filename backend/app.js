/**
 * Express is a minimal and flexible Node.js web application framework
 * that provides a robust set of features for web and mobile applications.
 */
const express = require("express");
const CONFIG = require("./src/config/default");
const routes = require("./src/routes/v1"); //routes to be used for auth purposes

require("./src/config/database.config"); //Database connection module

const app = express();
require("./src/config/express.config")(app); //CORS and other configs

app.use(`${CONFIG.API_PREFIX}/v1`, routes); //for using routes declared in that section.

let port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is up and running on port  ${port}`);
});
