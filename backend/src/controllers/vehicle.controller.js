const { Vehicle } = require("../models");
const { getVehicleById, saveVehicle } = require("../services/vehicle.service");
const EVENT = require("../triggers/custom-events").customEvent;
const AUX = require("../helpers/auxilaries");
const httpStatus = require("http-status");

const getVehicle = async (params, res) => {
  try {
    const vehicle = await getVehicleById(params.vehicleId);
    res.status(200).send({
      status: true,
      vehicle,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getUserVehicles = async (params, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: params.userId })
      .limit(params.perPage)
      .skip(params.page * params.perPage);
    const count = await Vehicle.find({ userId: params.userId }).count();

    res.status(200).send({
      status: true,
      page: params.page,
      totalResults: count,
      vehicles,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const vehicleRegistration = async (params, files, res) => {
  try {
    let vehicle = await saveVehicle(params);

    if (files[0]) {
      const photo = await AUX.uploadToAws(
        files[0].buffer,
        vehicle._id,
        files[0].mimetype
      );
      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        vehicle._id,
        {
          photo: photo.Location,
        },
        { new: true }
      );
      vehicle = updatedVehicle;
    }

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
  getVehicle,
  getUserVehicles,
  vehicleRegistration,
};
