const JWT = require("jsonwebtoken");
const CONFIG = require("../config/default");
const httpStatus = require("http-status");
const BCRYPT = require("bcrypt");
const AUX = require("../helpers/auxilaries");
const { User } = require("../models");
const {
  saveRoute,
  findRouteById,
  getPaginatedRoutesByUserId,
  getRouteCountByOwnerId,
  deleteRouteById,
} = require("../services/route.service");
const EVENT = require("../triggers/custom-events").customEvent;
const Route = require("../models/Route.model");
const Comment = require("../models/Comment.model");

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
      owner,
      routeLength,
      vehicleId,
      routeSnap,
      imageType,
    } = params;

    const desc = JSON.parse(descriptors);
    const coords = JSON.parse(coordinates);

    const veh = {
      rideName,
      descriptors: desc,
      isPublic,
      coordinates: coords,
      owner,
      routeLength,
    };
    let rt = await saveRoute(veh);

    if (routeSnap) {
      const photo = await AUX.uploadToAws(
        routeSnap,
        `routes/${rt._id}`,
        imageType
      );
      const updatedRoute = await Route.findByIdAndUpdate(
        rt._id,
        {
          routeSnap: photo.Location,
        },
        { new: true }
      );
      rt = updatedRoute;
    }

    EVENT.emit("update-route-in-user", rt._id, owner);
    EVENT.emit("update-route-distance-in-vehicle", vehicleId, routeLength);
    EVENT.emit("update-activity-log", {
      userId: owner,
      message: "You saved a new route",
      extraInfo: {
        activityType: "SAVE_NEW_ROUTE",
        documentName: "routeId",
        relatedDocumentId: rt._id,
      },
    });

    res.status(200).send({
      message: "Route saved successfully",
      route: rt,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getSingleRoute = async (params, res) => {
  try {
    // await AUX.checkIfValidId(params.routeId, res);
    const route = await findRouteById(params.routeId);
    if (route) {
      return res.status(httpStatus.OK).send({
        status: true,
        route,
      });
    }
    return AUX.apiResposne(
      res,
      httpStatus.BAD_REQUEST,
      false,
      "Route doesn't exist"
    );
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getUserRoutes = async (params, res) => {
  try {
    // await AUX.checkIfValidId(params.routeId, res);
    const route = await getPaginatedRoutesByUserId(
      params.userId,
      params.perPage,
      params.page
    );
    const count = await getRouteCountByOwnerId(params.userId);

    return res.status(httpStatus.OK).send({
      status: true,
      route,
      page: params.page,
      totalResults: count,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const deleteRoute = async (params, res) => {
  try {
    // await AUX.checkIfValidId(params.routeId, res);
    const route = await deleteRouteById(params.routeId);
    EVENT.emit("delete-route-in-user", params.routeId, params.userId);

    if (route) {
      return res.status(httpStatus.OK).send({
        message: "route deleted successfully",
        status: true,
      });
    }
    return AUX.apiResposne(
      res,
      httpStatus.BAD_REQUEST,
      false,
      "Route doesn't exist"
    );
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const runRoute = async (params, res) => {
  try {
    const { routeId, userId, totalDistance, vehicleId } = params;

    const updatedRoute = await Route.findByIdAndUpdate(
      routeId,
      {
        $inc: { timesTaken: 1, totalDistanceCovered: totalDistance },
        $push: { riddenBy: userId },
      },
      { new: true }
    );
    EVENT.emit("update-route-distance-in-vehicle", vehicleId, totalDistance);
    EVENT.emit("update-activity-log", {
      userId: userId,
      message: "You ran a route",
      extraInfo: {
        activityType: "RUN_ROUTE",
        documentName: "routeId",
        relatedDocumentId: routeId,
      },
    });

    return res.status(httpStatus.OK).send({
      status: true,
      message: "route ran successfully",
      route: updatedRoute,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const rateRoute = async (params, res) => {
  try {
    const { userId, routeId, comment, rating } = params;

    const review = await Comment.create({
      userId,
      routeId,
      message: comment,
      rating,
    });
    const route = await Route.findById(routeId);

    const averageRating = (route.totalRating * 5 + rating) / 5;
    const updatedRoute = await Route.findByIdAndUpdate(
      routeId,
      {
        totalRating: route.totalRating == 0 ? rating : averageRating,
      },
      { new: true }
    );
    EVENT.emit("update-activity-log", {
      userId: userId,
      message: "You rated a route",
      extraInfo: {
        activityType: "RATE_ROUTE",
        documentName: "reviewId",
        relatedDocumentId: review._id,
      },
    });

    res.status(200).send({
      message: "Review added successfully",
      route: updatedRoute,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

const getUserListing = async (params, res) => {
  try {
    const { perPage, page } = params;

    const routes = await Route.find({})
      .sort({ createdAt: -1 })
      .limit(parseInt(perPage))
      .skip(page * perPage)
      .lean(["totalRating"]);

    res.status(200).send({
      status: true,
      routes,
    });
  } catch (err) {
    return AUX.apiResposne(res, httpStatus.BAD_REQUEST, false, err.message);
  }
};

module.exports = {
  test,
  saveTrack,
  getSingleRoute,
  getUserRoutes,
  deleteRoute,
  runRoute,
  rateRoute,
  getUserListing,
};
