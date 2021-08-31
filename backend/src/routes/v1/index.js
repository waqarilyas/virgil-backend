const express = require("express");
const authRoute = require("./auth.routes");
const generalRoute = require("./general.routes");
const config = require("../../config/default");
const docsRoute = require("./docs.routes");
const userRoute = require("./user.routes");
const vehicleRoute = require("./vehicle.routes");
const trackRoute = require("./track.routes");
const requestRoute = require("./requests.routes");

const router = express.Router();

exports.foo = function () {};

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/general",
    route: generalRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/vehicle",
    route: vehicleRoute,
  },
  {
    path: "/track",
    route: trackRoute,
  },
  {
    path: "/request",
    route: requestRoute,
  },
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
if (config.ENV === "STAGING") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
