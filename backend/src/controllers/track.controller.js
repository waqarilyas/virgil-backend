const JWT = require("jsonwebtoken");
const CONFIG = require("../config/default");
const httpStatus = require("http-status");
const BCRYPT = require("bcrypt");
const AUX = require("../helpers/auxilaries");
const { User } = require("../models");
const { saveRoute } = require("../services/route.service");
const EVENT = require("../triggers/custom-events").customEvent;
const Route = require("../models/Route.model");

const test = (params, res) => {
  res.status(200).send({
    message: "Test successfull",
  });
};

const saveTrack = async (params, files, res) => {
  try {
    const {
      rideName,
      descriptors,
      isPublic,
      coordinates,
      distanceCovered,
      timeTaken,
      owner,
      userId,
    } = params;
    const veh = {
      rideName,
      descriptors,
      isPublic,
      coordinates,
      distanceCovered,
      timeTaken,
      owner,
      userId,
    };
    const rt = await saveRoute(veh);
    const photo = await AUX.uploadToAws(
      files[0].buffer,
      rt._id,
      files[0].mimetype
    );
    const updatedRoute = await Route.findByIdAndUpdate(
      rt._id,
      {
        routeSnap: photo.Location,
      },
      { new: true }
    );

    EVENT.emit("update-route-in-user", rt._id, params.userId);

    res.status(200).send({
      message: "Route saved successfully",
      route: updatedRoute,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getSingleRoute = () => {
  try {
    res.status(200).send({
      message: "Route saved successfully",
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test,
  saveTrack,
  getSingleRoute,
};
