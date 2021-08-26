const { User, Vehicle, Stop } = require("../models");
const Route = require("../models/Route.model");
const { updateUserById } = require("../services/user.service");
const { saveNewActivityLog } = require("../services/activityLog.service");
const { saveNotification } = require("../services/notification.service");

const axios = require("axios");
const { FIREBASE_SERVER_KEY } = require("../config/default");

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
    $pull: { routes: routeId },
  });
  console.log("--user route deleted successfully--");
};

const updateVehicleDistance = async (vehicleId, routeLength) => {
  await Vehicle.findByIdAndUpdate(vehicleId, {
    $inc: { distanceCovered: routeLength, totalTrips: 1 },
  });
};

const updateActivityLog = async (params) => {
  await saveNewActivityLog(params);
};

const sendAndStoreNotification = async (params) => {
  const { token, extraData, message, userId, extraInfo } = params;

  let data = JSON.stringify({
    to: token,
    data: extraData,
    notification: {
      title: "Virgil",
      body: message,
      mutable_content: true,
      sound: "Tri-tone",
      priority: "high",
    },
  });

  const config = {
    method: "post",
    url: "https://fcm.googleapis.com/fcm/send",
    headers: {
      "Content-Type": "application/json",
      Authorization: FIREBASE_SERVER_KEY,
    },
    data,
  };
  await axios(config);
  console.log("--notification sent successfully--");

  const notifyParams = {
    userId,
    message: message,
    extraInfo,
  };

  await saveNotification(notifyParams);
};

const updateRequestInUser = async (params) => {
  await User.findOneAndUpdate(params.userId, {
    $push: { requests: params.requestId },
  });
};

const saveRouteStops = async (params) => {
  const { routeId, stops } = params;

  if (stops.length > 0) {
    stops.forEach(async (st) => {
      const { coords, name, type } = st;
      const stopParams = {
        routeId,
        coords,
        name,
        type,
      };
      const stp = await Stop.create(stopParams);
      await Route.findOneAndUpdate(
        { _id: routeId },
        { $push: { stops: stp._id } }
      );
    });
  }
};

module.exports = {
  updateUserVehicle,
  updateUserRoute,
  deleteRouteFromUser,
  updateVehicleDistance,
  updateActivityLog,
  sendAndStoreNotification,
  updateRequestInUser,
  saveRouteStops,
};
