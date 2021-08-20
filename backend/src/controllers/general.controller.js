const { saveVehicle } = require("../services/vehicle.service");
const httpStatus = require("http-status");
const AUX = require("../helpers/auxilaries");
const { Vehicle, Comment, ActivityLog } = require("../models");

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
      .lean();

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

    const log = await ActivityLog.find({ userId: userId }).lean();

    res.status(200).send({
      status: true,
      page,
      activityLog: log,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test,
  getUserReviews,
  getUserActivityLog,
};
