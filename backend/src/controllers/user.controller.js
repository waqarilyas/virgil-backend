const httpStatus = require("http-status");
const { Mongoose } = require("mongoose");
const AUX = require("../helpers/auxilaries");
const { Vehicle, User, Requests } = require("../models");
var mongoose = require("mongoose");

const {
  getUserById,
  getPaginatedUsers,
  getPopulatedUser,
} = require("../services/user.service");
const { FRIEND_STATUS } = require("../helpers/enums");

const test = (params, res) => {
  return res.status(200).send({
    message: "successfull",
    id: params.id,
  });
};

const getUser = async (params, res) => {
  try {
    const user = await getPopulatedUser(
      params.id,
      "vehicles routes favouriteRoutes friends"
    );

    res.status(200).send({
      status: true,
      user,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getAllUsers = async (params, res) => {
  try {
    const { page, perPage, userId } = params;
    const currentUser = await User.findOne({ _id: userId }).populate(
      "requests"
    );
    console.log(currentUser.requests);
    const users = await getPaginatedUsers(userId, page, perPage);
    users.forEach(async (item, index) => {
      if (
        currentUser?.friends.some(function (friend) {
          return friend.equals(item._id);
        })
      ) {
        item.status = FRIEND_STATUS.friend;
      } else if (
        currentUser?.requests.some(function (req) {
          return req.requestTo.equals(item._id) && req.status == "notAccepted";
        })
      ) {
        item.status = FRIEND_STATUS.requested;
      } else {
        let requestedByme = item.requests.filter((req) =>
          req.requestFrom.equals(currentUser._id)
        );
        if (requestedByme.length > 0) {
          item.status = FRIEND_STATUS.requested;
        } else {
          item.status = FRIEND_STATUS.anon;
        }
      }
    });

    res.status(200).send({
      status: true,
      users,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getUserFriends = async (params, res) => {
  try {
    const { userId, page, perPage } = params;
    const user = await User.findOne({ _id: userId }).populate({
      path: "friends",
      options: {
        limit: parseInt(perPage),
        sort: { created: -1 },
        skip: page * perPage,
      },
    });

    res.status(200).send({
      status: true,
      page,
      data: user.friends,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const updateUser = async (params, userId, files, res) => {
  try {
    let dataToUpdate = {
      ...params,
    };
    if (files?.length > 0) {
      await AUX.deleteFromAWS(`users/${userId}/profile`);

      const photo = await AUX.uploadToAws(
        files[0].buffer,
        `users/${userId}/profile`
      );
      dataToUpdate.profileImage = photo.Location;
    }
    const user = await User.findByIdAndUpdate(userId, dataToUpdate, {
      new: true,
    });

    res.status(httpStatus.OK).send({
      status: true,
      message: "user updated successfully",
      user: user,
    });
  } catch (err) {
    console.log(err);
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const updateLocation = async (params, userId, res) => {
  try {
    let dataToUpdate = {
      location: {
        lat: params.lat,
        lng: params.lng
      }
    };
    const user = await User.findByIdAndUpdate(userId, dataToUpdate, {
      new: true,
    });
    console.log(user);

    res.status(httpStatus.OK).send({
      status: true,
      message: "User location updated successfully",
    });
  } catch (err) {
    console.log(err);
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test,
  getUser,
  getAllUsers,
  getUserFriends,
  updateUser,
  updateLocation
};
