require("dotenv").config(); //for importing variables from .env file for local development

module.exports = {
  PORT: process.env.PORT,
  API_PREFIX: "/api",
  ENV: process.env.NODE_ENV,
  DATABASE_PATH: process.env.MONGODB_URL,
  DB_NAME: process.env.DB_NAME,
  tokenKey: process.env.JWT_TOKEN_KEY,
  generalErrorResponse:
    "Couldn't get response from the server. Please try again.",
  senderEmail: process.env.EMAIL_FROM,
  SG_API_KEY: process.env.SG_API_KEY,
  AUTH_HEADER_PREFIX: "Bearer ",
  FRONT_END_BASE_PATH: "",
  jwtSecret: process.env.JWT_SECRET,
  AWS: {
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    bucket: process.env.bucket,
  },
};
