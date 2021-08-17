const httpStatus = require("http-status");
const { Token, Vehicle, ActivityLog } = require("../models");
const ApiError = require("../helpers/ApiError");

const saveNewActivityLog = async (params) => {
  return await ActivityLog.create(params);
};

module.exports = {
  saveNewActivityLog,
};
