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
  getRequestById,
  changeRequestStatus,
  getRequestsByRequestTo,
} = require("../services/request.service");

const {
  addToUserFriends,
  removeUserFriend,
} = require("../services/user.service");

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

const acceptRejectFriendRequest = async (params, res) => {
  try {
    const { requestId, operation } = params;
    const request = await getRequestById(requestId);

    // operation can be ACCEPT or REJECT
    if (operation === "REJECT") {
      await changeRequestStatus(requestId, "REJECTED");
      await removeUserFriend(request.requestFrom, request.requestTo);
      return res.status(200).send({
        message: "Friend Request rejected succesfully",
        status: true,
      });
    } else if (operation === "ACCEPT") {
      await changeRequestStatus(requestId, "ACCEPTED");
      await addToUserFriends(request.requestFrom, request.requestTo);
      await addToUserFriends(request.requestTo, request.requestFrom);

      return res.status(200).send({
        message: "Friend Request accepted successfully",
        status: true,
      });
    }

    return res.status(400).send({
      message:
        "Invalid operation. Operation can either be 'ACCEPT' or 'REJECT'",
      status: true,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getFriendRequests = async (params, res) => {
  try {
    const { userId } = params;

    const requests = await getRequestsByRequestTo(userId);

    return res.status(200).send({
      message: "successfull",
      status: true,
      requests,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test,
  sendFriendRequest,
  acceptRejectFriendRequest,
  getFriendRequests,
};
