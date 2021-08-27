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
      .limit(parseInt(params.perPage))
      .skip(params.page * params.perPage)
      .lean();

    const count = await Vehicle.find({
      userId: params.userId,
    }).countDocuments();

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
    if (files.length > 0) {
      const photo = await AUX.uploadToAws(
        files[0].buffer,
        `vehicles/cover/${vehicle._id}`,
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
    EVENT.emit("update-activity-log", {
      userId: params.userId,
      message: "You saved a new vehicle",
      extraInfo: {
        activityType: "SAVE_VEHICLE",
        documentName: "vehicleId",
        relatedDocumentId: vehicle._id,
      },
    });

    res.status(httpStatus.OK).send({
      status: true,
      message: "Vehicle registered successfully",
      vehicle: vehicle,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const updateVechile = async (params, files, userId, res) => {
  try {
    let dataToUpdate = {
      ...params
    }
    if (files.length > 0) {
      const photo = await AUX.uploadToAws(
        files[0].buffer,
        `vehicles/cover/${params.vehicleId}`,
      );
      dataToUpdate['photo'] = photo.Location;
    }
    const vehicle = await Vehicle.findByIdAndUpdate(
      params.vehicleId,
      dataToUpdate,
      { new: true }
    );

    EVENT.emit("update-activity-log", {
      userId: userId,
      message: `You updated vehicle ${vehicle.make}`,
      extraInfo: {
        activityType: "UPDATE_VEHICLE",
        documentName: "vehicleId",
        relatedDocumentId: vehicle._id,
      },
    });

    res.status(httpStatus.OK).send({
      status: true,
      message: "Vehicle updated successfully",
      vehicle: vehicle,
    });
  } catch (err) {
    console.log(err);
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  getVehicle,
  getUserVehicles,
  vehicleRegistration,
  updateVechile
};
