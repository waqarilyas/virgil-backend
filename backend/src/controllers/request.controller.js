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

    const receiver = await User.findOne({ _id: requestTo });
    const sender = await User.findOne({ _id: requestFrom });

    params.type = "FriendRequest";

    const req = await saveRequest(params);

    EVENT.emit("update-request-in-user", {
      userId,
      requestId: req._id,
    });

    EVENT.emit("send-notification", {
      userId: receiver._id,
      token: receiver.deviceId,
      message: `${
        sender.firstName + " " + sender.lastName
      } sent you a friend request`,
      extraInfo: {
        activityType: "SEND_REQUEST",
        documentName: "senderId",
        relatedDocumentId: requestFrom,
      },
    });

    EVENT.emit("update-activity-log", {
      userId: requestFrom,
      message: "You sent a friend request",
      extraInfo: {
        activityType: "SEND_REQUEST",
        documentName: "FriendId",
        relatedDocumentId: requestTo,
      },
    });

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
      EVENT.emit("update-activity-log", {
        userId: request.requestTo,
        message: "You rejected friend request",
        extraInfo: {
          activityType: "REQUEST_REJECT",
          documentName: "senderId",
          relatedDocumentId: request.requestFrom,
        },
      });

      return res.status(200).send({
        message: "Friend Request rejected succesfully",
        status: true,
      });
    } else if (operation === "ACCEPT") {
      await changeRequestStatus(requestId, "ACCEPTED");
      await addToUserFriends(request.requestFrom, request.requestTo);
      await addToUserFriends(request.requestTo, request.requestFrom);

      EVENT.emit("update-activity-log", {
        userId: request.requestTo,
        message: "You accepted friend request",
        extraInfo: {
          activityType: "REQUEST_ACCEPT",
          documentName: "senderId",
          relatedDocumentId: request.requestFrom,
        },
      });

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
