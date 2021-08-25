const httpStatus = require("http-status");
const { Token, Vehicle, ActivityLog, Notification } = require("../models");
const ApiError = require("../helpers/ApiError");

const saveNotification = async (params) => {
  return await Notification.create(params);
};

module.exports = {
  saveNotification,
};
