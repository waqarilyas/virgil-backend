const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../helpers/ApiError");
const { $where } = require("../models/token.model");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  console.log("userbody:", userBody);
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).lean();
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

const changeUserPassword = async (email, password) => {
  let user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  user = await User.findOneAndUpdate(
    { email: email },
    {
      password: password,
    },
    {
      insert: true,
    }
  );

  return user;
};

const addToUserFriends = async (userId, friendId) => {
  await User.findByIdAndUpdate(userId, { $push: { friends: friendId } });
};

const removeUserFriend = async (userId, friendId) => {
  await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
};

const getPaginatedUsers = async (userId, page, perPage) => {
  return await User.find({ _id: { $ne: userId } })
    .limit(parseInt(perPage))
    .skip(page * perPage)
    .populate("requests")
    .lean();
};

const getPopulatedUser = async (id, fields) => {
  return User.findById(id).populate(fields);
};

const updateUserDeviceId = async (userId, deviceId) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { deviceId: deviceId },
    { new: true }
  );
};

// const removeUserFriend = async (userId, friendId) => {};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  changeUserPassword,
  addToUserFriends,
  removeUserFriend,
  getPaginatedUsers,
  getPopulatedUser,
  updateUserDeviceId,
};
