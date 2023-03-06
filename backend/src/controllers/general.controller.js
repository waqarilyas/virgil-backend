const { saveVehicle } = require("../services/vehicle.service");
const { getNotificationsByUser } = require("../services/notification.service");

const httpStatus = require("http-status");
const AUX = require("../helpers/auxilaries");
const { Vehicle, Comment, ActivityLog, User } = require("../models");
const { FIREBASE_SERVER_KEY } = require("../config/default");
const EVENT = require("../triggers/custom-events").customEvent;
const axios = require("axios");
const { NOTIFICATION_TYPES } = require("../helpers/enums");
const Route = require("../models/Route.model");

const test = function (req, files, res) {
  res.status(200).send({
    status: true,
  });
};

const getUserReviews = async (params, res) => {
  try {
    const { userId, page, perPage } = params;

    const comments = await Comment.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(perPage))
      .skip(page * perPage)
      .lean()
      .populate("route");

    res.status(200).send({
      status: true,
      page,
      comments,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getUserActivityLog = async (params, res) => {
  try {
    const { userId, page, perPage } = params;

    const log = await ActivityLog.find({ userId: userId })
      .limit(parseInt(perPage))
      .skip(page * perPage)
      .lean();

    res.status(200).send({
      status: true,
      page,
      activityLog: log,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const notificationTest = async (params, res) => {
  try {
    const { deviceId } = params;

    let data = JSON.stringify({
      to: deviceId,
      data: {
        name: "DATA",
      },
      notification: {
        title: "Virgil",
        body: "This is a test notification",
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
    await axios(config).then((dt) => {
      res.status(200).send({
        status: true,
        message: "Notification sent successfully",
      });
    });
  } catch (err) {
    console.log(err);
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const inviteToRide = async (params, res) => {
  try {
    const { receivers, routeId, message } = params;
    let rec = JSON.parse(receivers);
    console.log("asjdhajskdhkas", params);
    const user = await User.findOne({ _id: rec[0]._id });

    // rec.forEach((item) => {
    if (user.enables.invite) {
      EVENT.emit("send-notification", {
        userId: user._id,
        token: user.deviceId,
        message: message,
        route: routeId,
        request: null,
        extraInfo: {},
      });
      res.status(200).send({
        status: true,
        activityLog: "Users invited for ride successfully",
      });
    } else {
      return res.status(400).send({
        message: "Invite cannot send to This User",
        status: false,
      });
    }

    // });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getUserNotifications = async (params, res) => {
  try {
    const { userId } = params;

    const notifications = await getNotificationsByUser(userId, "route request");

    res.status(200).send({
      status: true,
      message: "Successfull",
      data: notifications,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const deleteRoutes = async (req, res) => {
  try {
    const deleted = await Route.deleteMany({
      owner: "617679c93422a90016e59180",
      $and: [
        { rideName: { $ne: "Pixel" } },
        { rideName: { $ne: "Test New2" } },
        { rideName: { $ne: "Test New1" } },
        { rideName: { $ne: "BN" } },
      ],
    });
    res.send("deleted");
  } catch (err) {
    res.send("There is an error");
  }
};

module.exports = {
  test,
  getUserReviews,
  getUserActivityLog,
  notificationTest,
  inviteToRide,
  getUserNotifications,
  deleteRoutes,
};
