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

module.exports = {
  saveRequest,
  checkIfFriendRequestExists,
};
