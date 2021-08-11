const { saveVehicle } = require("../services/vehicle.service");
const httpStatus = require("http-status");
const AUX = require("../helpers/auxilaries");
const EVENT = require("../triggers/custom-events").customEvent;
const { Vehicle } = require("../models");

const test = function (req, files, res) {
  res.status(200).send({
    status: true,
  });
};

const vehicleRegistration = async (params, files, res) => {
  try {
    const vehicle = await saveVehicle(params);
    const photo = await AUX.uploadToAws(
      files[0].buffer,
      vehicle._id,
      files[0].mimetype
    );

    await Vehicle.findByIdAndUpdate(vehicle._id, { photo: photo.Location });

    EVENT.emit("update-vehicle-in-user", vehicle._id, params.userId);
    res.status(httpStatus.OK).send({
      status: true,
      message: "Vehicle registered successfully",
      vehicle: vehicle,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test: test,
  vehicleRegistration,
};
