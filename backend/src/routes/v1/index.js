const express = require('express');
const authRoute = require('./auth.routes');
const config = require('../../config/default');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
];

const devRoutes = [
  // {
  //   path: '/docs',
  //   route: docsRoute,
  // },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.ENV === 'staging') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
