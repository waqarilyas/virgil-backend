const { saveVehicle } = require("../services/vehicle.service");
const httpStatus = require("http-status");
const AUX = require("../helpers/auxilaries");
const { Vehicle, Comment, ActivityLog, User } = require("../models");
const { FIREBASE_SERVER_KEY } = require("../config/default");
const EVENT = require("../triggers/custom-events").customEvent;
const axios = require("axios");

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
        Authorization: FIREBASE_SERVER_KEY,
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
    // const user = await User.findOne({ _id: userId });
    let rec = JSON.parse(receivers);

    rec.forEach((item) => {
      EVENT.emit("send-notification", {
        userId: item._id,
        token: item.deviceId,
        message: message,
        extraInfo: {
          activityType: "RIDE_REQUEST",
          documentName: "routeId",
          relatedDocumentId: routeId,
        },
      });
    });

    res.status(200).send({
      status: true,
      activityLog: "Users invited for ride successfully",
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test,
  getUserReviews,
  getUserActivityLog,
  notificationTest,
  inviteToRide,
};
