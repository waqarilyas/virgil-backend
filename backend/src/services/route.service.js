const httpStatus = require("http-status");
const { Token, Vehicle } = require("../models");
const ApiError = require("../helpers/ApiError");
const Route = require("../models/Route.model");

const saveRoute = async (params) => {
  return await Route.create(params);
};

module.exports = {
  saveRoute,
};
