const { version } = require("../../package.json");
const config = require("../config/default");

const swaggerDef = {
  openapi: "3.0.3",
  info: {
    title: "VIRGIL API documentation",
    version,
    license: {
      name: "MIT",
      url: "https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/api/v1`,
    },
  ],
  security: [{ bearerAuth: [] }],
};

module.exports = swaggerDef;
