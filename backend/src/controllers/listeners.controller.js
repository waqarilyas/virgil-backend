const { User, Vehicle, Stop, Comment } = require("../models");
const Route = require("../models/Route.model");
const { updateUserById } = require("../services/user.service");
const { saveNewActivityLog } = require("../services/activityLog.service");
const { saveNotification } = require("../services/notification.service");
const AUX = require("../helpers/auxilaries");

const axios = require("axios");
const { FIREBASE_SERVER_KEY } = require("../config/default");
const { RIDER_REQUEST_TYPE } = require("../helpers/enums");

const updateUserVehicle = async (vehicleId, userid) => {
  await User.findByIdAndUpdate(userid, {
    $push: { vehicles: vehicleId },
  });
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
  try {
    const { token, extraData, message, userId, extraInfo, request, route } =
      params;

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
        Authorization: `key=${FIREBASE_SERVER_KEY}`,
      },
      data,
    };
    await axios(config);

    let notifyParams = {
      userId,
      message: message,
      extraInfo,
    };
    if (route) {
      notifyParams.route = route;
    }
    if (request) {
      notifyParams.request = request;
    }

    await saveNotification(notifyParams);
  } catch (err) {
    console.log("---error handling notification---", err);
  }
};

const updateRequestInUser = async (params) => {
  await User.findOneAndUpdate(params.requestFrom, {
    $push: { requests: params.requestId },
  });
};

const saveRouteStops = async (params) => {
  try {
    const { routeId, stops, files } = params;
    console.log("total stops:", stops);

    let fs = files.filter((file) => file.fieldname != "routeSnap");

    if (stops.length > 0) {
      stops.forEach(async (st, ind) => {
        const { coords, name, type, id, stopType } = st;
        const stopParams = {
          routeId,
          coords,
          name,
          type,
          stopType,
        };
        const stp = await Stop.create(stopParams);
        console.log("stop added:", stp);

        fs.forEach(async (file, index) => {
          if (file.fieldname == id) {
            const photo = await AUX.uploadToAws(
              file.buffer,
              `routes/${routeId}/stops/${stp._id}/${index}`
            );
            console.log("image uploaded:", photo);

            await Stop.findOneAndUpdate(
              { _id: stp._id },
              { $push: { images: photo.Location } }
            );
          }
        });

        await Route.findOneAndUpdate(
          { _id: routeId },
          { $push: { stops: stp._id }, $inc: { numStops: 1 } }
        );
      });
    }
    console.log("---stops saved successfully----");
  } catch (err) {
    console.log("---error saving stops----", err);
  }
};

const uploadReviewImages = async (params) => {
  const { files, review } = params;
  files.forEach(async (item, index) => {
    const photo = await AUX.uploadToAws(
      item.buffer,
      `routes/reviews/${review}/${index}`
    );

    await Comment.findOneAndUpdate(
      { _id: review },
      {
        $push: { images: photo.Location },
      }
    );
  });
};

const deleteVehicleInUser = async (vehicleId, userId) => {
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $pull: { vehicles: vehicleId },
    }
  );
};

const updateRouteRider = async (routeId, userId, type) => {
  switch (type) {
    case RIDER_REQUEST_TYPE.ADD:
      await Route.findOneAndUpdate(
        { _id: routeId },
        { $push: { currentRiders: userId }, $inc: { numCurrentRiders: 1 } }
      );
      console.log("---user successfully added to current riders---");
      break;

    case RIDER_REQUEST_TYPE.REMOVE:
      await Route.findOneAndUpdate(
        { _id: routeId },
        { $pull: { currentRiders: userId }, $inc: { numCurrentRiders: -1 } }
      );
      console.log("---user successfully removed from current riders---");
      break;
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
  uploadReviewImages,
  deleteVehicleInUser,
  updateRouteRider,
};
