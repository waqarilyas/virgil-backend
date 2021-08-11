const { User } = require("../models");
const { updateUserById } = require("../services/user.service");

const updateUserVehicle = async (vehicleId, userid) => {
  await User.findByIdAndUpdate(userid, {
    $push: { vehicles: vehicleId },
  });
  console.log("--user has been updated successfully--");
};

module.exports = {
  updateUserVehicle,
};
