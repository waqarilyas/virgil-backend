const JWT = require("jsonwebtoken");
const CONFIG = require("../config/default");
const httpStatus = require("http-status");
const BCRYPT = require("bcrypt");
const AUX = require("../helpers/auxilaries");
const EVENT = require("../triggers/custom-events").customEvent;
const { User } = require("../models");
const {
  saveRequest,
  checkIfFriendRequestExists,
} = require("../services/request.service");

const test = (params, res) => {
  res.status(200).send({
    message: "test successsfull",
  });
};

const sendFriendRequest = async (params, res) => {
  try {
    const { requestFrom, requestTo } = params;

    if (requestFrom === requestTo) {
      return res.status(400).send({
        message: "User cannot send friend request to himself",
        status: false,
      });
    }

    if (await checkIfFriendRequestExists(params)) {
      return res.status(400).send({
        message: "Friend request already exists",
        status: false,
      });
    }

    params.type = "FriendRequest";
    await saveRequest(params);
    res.status(200).send({
      message: "Friend Request sent successfully",
      status: true,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test,
  sendFriendRequest,
};
