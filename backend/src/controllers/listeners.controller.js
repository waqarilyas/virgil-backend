const { User, Vehicle } = require("../models");
const Route = require("../models/Route.model");
const { updateUserById } = require("../services/user.service");
const { saveNewActivityLog } = require("../services/activityLog.service");
const https = require("https");

const updateUserVehicle = async (vehicleId, userid) => {
  await User.findByIdAndUpdate(userid, {
    $push: { vehicles: vehicleId },
  });
  console.log("--user vehicle updated successfully--");
};

const updateUserRoute = async (routeId, userId) => {
  await User.findByIdAndUpdate(userId, {
    $push: { routes: routeId },
  });

  console.log("--user route updated successfully--");
};

const deleteRouteFromUser = async (routeId, userId) => {
  await User.findByIdAndUpdate(userId, {
    $pop: { routes: routeId },
  });
  console.log("--user route deleted successfully--");
};

const updateVehicleDistance = async (vehicleId, routeLength) => {
  await Vehicle.findByIdAndUpdate(vehicleId, {
    $inc: { distanceCovered: routeLength, totalTrips: 1 },
  });

  console.log("vehicle total distance and route number updated successfully");
};

const updateActivityLog = async (params) => {
  await saveNewActivityLog(params);
  console.log("--user activity log saved successfully--");
};

const sendAndStoreNotification = async (params) => {};

module.exports = {
  updateUserVehicle,
  updateUserRoute,
  deleteRouteFromUser,
  updateVehicleDistance,
  updateActivityLog,
  sendAndStoreNotification,
};
