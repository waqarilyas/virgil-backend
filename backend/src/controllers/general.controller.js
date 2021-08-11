const { saveVehicle } = require("../services/vehicle.service");
const httpStatus = require("http-status");
const AUX = require("../helpers/auxilaries");
const { Vehicle } = require("../models");

const test = function (req, files, res) {
  res.status(200).send({
    status: true,
  });
};

module.exports = {
  test: test,
};
