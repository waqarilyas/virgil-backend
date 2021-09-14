const httpStatus = require("http-status");
const { Token, Vehicle, ActivityLog, Notification } = require("../models");
const ApiError = require("../helpers/ApiError");

const saveNotification = async (params) => {
  return await Notification.create(params);
};

const getNotificationsByUser = async (userId, fieldsToPopulate) => {
  return await Notification.find({ userId: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: fieldsToPopulate,
      populate: {
        path: "requestFrom",
      },
    });
};

module.exports = {
  saveNotification,
  getNotificationsByUser,
};
