const httpStatus = require("http-status");
const { Token, Vehicle, Requests, User } = require("../models");
const ApiError = require("../helpers/ApiError");

const saveRequest = async (params) => {
  const req = await Requests.create(params);

  await User.findOneAndUpdate(
    { _id: params.requestFrom },
    { $push: { requests: req._id } }
  );

  await User.findOneAndUpdate(
    { _id: params.requestTo },
    { $push: { requests: req._id } }
  );
  return req;
};
const checkIfFriendRequestExists = async (params) => {
  const res = await Requests.find({
    requestFrom: params.requestFrom,
    requestTo: params.requestTo,
  });

  return res.length > 0 ? true : false;
};

const getRequestById = async (requestId) => {
  return await Requests.findOne({ _id: requestId });
};

const changeRequestStatus = async (requestId, status) => {
  return await Requests.findByIdAndUpdate(
    requestId,
    { status: status },
    { new: true }
  );
};

const getRequestsByRequestTo = async (requestTo) => {
  return await Requests.find({
    requestTo: requestTo,
    status: "notAccepted",
  }).populate("requestFrom");
};

module.exports = {
  saveRequest,
  checkIfFriendRequestExists,
  getRequestById,
  changeRequestStatus,
  getRequestsByRequestTo,
};
