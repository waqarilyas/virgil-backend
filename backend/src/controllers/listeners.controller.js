const { User } = require("../models");
const { updateUserById } = require("../services/user.service");

const updateUserVehicle = async (vehicleId, userid) => {
  await User.findByIdAndUpdate(userid, {
    $push: { vehicles: vehicleId },
  });
  console.log("--user vehicle updated successfully--");
};

const updateUserRoute = async (routeId, userId) => {
  await User.findByIdAndUpdate(userId, {
    $push: { routes: routeId },
  });
  console.log("--user route updated successfully--");
};

module.exports = {
  updateUserVehicle,
  updateUserRoute,
};
