const httpStatus = require("http-status");
const { Token, Vehicle } = require("../models");
const ApiError = require("../helpers/ApiError");

const saveVehicle = async (params) => {
  return await Vehicle.create(params);
};

module.exports = {
  saveVehicle,
};
