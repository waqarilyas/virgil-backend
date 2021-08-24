const httpStatus = require("http-status");
const AUX = require("../helpers/auxilaries");
const { Vehicle, User } = require("../models");

const { getUserById, getPaginatedUsers } = require("../services/user.service");

const test = (params, res) => {
  return res.status(200).send({
    message: "successfull",
    id: params.id,
  });
};

const getUser = async (params, res) => {
  try {
    const user = await getUserById(params.id);

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
    const users = await getPaginatedUsers(page, perPage);
    res.status(200).send({
      status: true,
      users,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test,
  getUser,
  getAllUsers,
};
