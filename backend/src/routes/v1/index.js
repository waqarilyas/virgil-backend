const express = require("express");
const authRoute = require("./auth.routes");
const generalRoute = require("./general.routes");
const config = require("../../config/default");
const docsRoute = require("./docs.routes");

const router = express.Router();

exports.foo = function () { };

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: '/general',
    route: generalRoute
  }
];

const devRoutes = [
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.ENV === "staging") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
