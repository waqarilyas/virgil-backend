const httpStatus = require("http-status");
const { Token, Vehicle, Requests } = require("../models");
const ApiError = require("../helpers/ApiError");

const saveRequest = async (params) => {
  return await Requests.create(params);
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
  return await Requests.find({ requestTo: requestTo, status: "notAccepted" });
};

module.exports = {
  saveRequest,
  checkIfFriendRequestExists,
  getRequestById,
  changeRequestStatus,
  getRequestsByRequestTo,
};
